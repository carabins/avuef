import {pathTo} from "./utils";
import {GlobalState} from "./global-state";
import {webPackActions} from "./wp-context";
import {A} from "alak";
import {Aloger} from "./logger";
import {graph} from "./graph";
import {contextAction, contextFlow, contextFlowPath} from "./utils/deepProxy";

const launch = (actionName, callerName, ...args) => {
  // Aloger.group(` 𝜶  ${actionName} ← ${callerName}`, args)
  let aFn = pathTo(actionName, actionModules)

  let ctxLabel = `𝜶.${actionName}`
  if (!aFn) {
    return Promise.reject(`𝗔ction "${actionName}" not found`)
  } else {
    let launch = actions.newDispatcher(ctxLabel)
    let maybePromise = aFn.apply({
      ctxLabel,
      a: launch, f: contextFlow(ctxLabel), ff: contextFlowPath(ctxLabel)
    }, args)
    if (maybePromise && typeof maybePromise.then === 'function') {
      GlobalState.setRun(actionName, true)
      return new Promise(((resolve, reject) => {
        maybePromise.then(r => {
          GlobalState.setRun(actionName, false)
          resolve(r)
        }).catch(e => {
          GlobalState.setRun(actionName, false)
          reject(e)
        })
      }))
    }
    return maybePromise
  }
}

function dispatchAction(...context) {
  let [contextType, ctxPath, ctxSym] = context
  return contextAction(contextType)
}


const runEntity = A.flow
// runEntity.on(app => {
//   let entry = actionModules['entry']
//   if (entry) {
//     Aloger.simple(" 𝜶  root.entry ← app")
//     entry(app)
//   }
// })


let actionModules = {}
export const actions = {
  newDispatcher: dispatchAction,
  launch,
  runEntity,
  get modules() {
    return actionModules
  },
  set(v) {
    let ctx = webPackActions(v)
    if (ctx) {
      actionModules = ctx()
    } else {
      actionModules = v
    }
  }
}
