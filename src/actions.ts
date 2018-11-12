import {pathTo} from "./utils";
import {GlobalState} from "./global-state";
import {webPackActions} from "./wp-context";
import {A} from "alak";
import {Aloger} from "./logger";
import {graph} from "./graph";
import {contextAction, contextFlow} from "./utils/deepProxy";

const doAction = (name, ctx, ...args) => {
  Aloger.group(` 𝜶 ${name} ← ${ctx}`, args)
  return launch(name, ...args)
}
const launcher = (ctx, ...args) => (name, ...args) => {
  Aloger.group(` 𝜶  ${name} ← ${ctx}`, args)
  return launch(name, ...args)
}
const launch = (actionName, ...args) => {

  let aFn = pathTo(actionName, actionModules)

  let ctxLabel = `𝜶 ${actionName}`
  if (!aFn) {
    console.error(`𝗔ction "${actionName}" not found`, args)
    return Promise.resolve(false)
  } else {
    let launch = actions.newDispatcher(ctxLabel)
    let maybePromise = aFn.apply({ a:launch, f: contextFlow(ctxLabel) }, args)
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
function dispatchAction (...context) {
  let [contextType, ctxPath, ctxSym] = context
  return contextAction(contextType)
  // return launcher([contextType, ctxPath, ctxSym].join(" "))
  // return launcher("xxx")
}


const runEntity = A.flow
runEntity.on(app => {
  let entry = actionModules['entry']
  if (entry) {
    Aloger.simple(" 𝜶  root.entry ← app")
    entry(app)
  }
})


let actionModules = {}
export const actions = {
  newDispatcher: dispatchAction,
  launch,
  runEntity,
  get modules(){
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
