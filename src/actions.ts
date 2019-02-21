import {pathTo} from "./utils";
import {GlobalState} from "./global-state";
import {webPackActions} from "./wp-context";
import {A} from "alak";
import {Aloger} from "./logger";
import {graph} from "./graph";
import {contextAction, contextFlow, contextFlowPath} from "./utils/deepProxy";

const launch = (actionName, callerName, sym, ...args) => {

  let aFn = pathTo(actionName, actionModules)




  if (!aFn) {
    let m = callerName ? callerName.split(".") : ""
    if (m.length>1){
      let mod = m[0]
      actionName = mod+"."+actionName
      aFn = pathTo(actionName, actionModules)
    }
  }
  // console.log(actionName, ...args)

  if (!aFn) {
    let errorMessage = `𝜶 ${actionName} ← ${callerName} ${sym}`
    console.error(`!!!  ${errorMessage}`, args)
    return Promise.reject(`ACTION ${errorMessage} NOT FOUND`)
  } else {
    Aloger.group(` 𝜶  ${actionName} ← ${callerName} ${sym}`, args)
    let ctxLabel = `${actionName} 𝜶`

    // console.log({ctxLabel})

    let maybePromise = aFn.apply({
      $g: GlobalState.data,
      $a: contextAction(actionName, "𝜶"),
      $f: contextFlow(ctxLabel), $ff: contextFlowPath(ctxLabel)
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


const runEntity = A.flow

let actionModules = {}
export const actions = {
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
      let am = {}
      Object.keys(v).forEach(k=>{
        let a = v[k].actions
        if (a){
          actionModules[k] = v[k].actions
          actionModules[k].path = k
        }
      })
    }
  }
}
