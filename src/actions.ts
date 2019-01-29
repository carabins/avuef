import {pathTo} from "./utils";
import {GlobalState} from "./global-state";
import {webPackActions} from "./wp-context";
import {A} from "alak";
import {Aloger} from "./logger";
import {graph} from "./graph";
import {contextAction, contextFlow, contextFlowPath} from "./utils/deepProxy";

const launch = (actionName, callerName, sym, ...args) => {

  let aFn = pathTo(actionName, actionModules)




  // if (m.length==1){
  //   mod = "$root"
  // }

  if (!aFn) {
    let m = callerName.split(".")
    if (m.length>1){
      let mod = m[0]
      actionName = mod+"."+actionName
      aFn = pathTo(actionName, actionModules)
    }
  }


  if (!aFn) {
    return Promise.reject(`𝗔ction "${actionName}" not found`)
  } else {
    Aloger.group(` 𝜶  ${actionName} ← ${sym} ${callerName}`, args)

    let ctxLabel = `𝜶.${actionName}`
    let maybePromise = aFn.apply({
      $a: contextAction(actionName, "𝜶"), $f: contextFlow(ctxLabel), $ff: contextFlowPath(ctxLabel)
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

// function dispatchAction(...context) {
//   let [contextType, ctxPath, ctxSym] = context
//   return contextAction(contextType)
// }


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
  // newDispatcher: dispatchAction,
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
      Object.keys(actionModules).forEach(k=>{
        actionModules[k].path = k
      })
    }
  }
}
