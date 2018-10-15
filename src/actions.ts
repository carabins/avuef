import {pathTo} from "./utils";
import {GlobalState} from "./global-state";
import {webPackActions} from "./wp-context";
import {A} from "alak";
import {Aloger} from "./logger";
import {graph} from "./graph";


let actionModules = {}
function dispatchAction (...context) {
  let [contextType, ctxPath, ctxSym] = context
  const launch = (action, ...params) => {
    let log = ` 𝜶  ${action} ← ${contextType} ${ctxPath ? ctxPath : ""} ${ctxSym ? ctxSym : ''}`
    let aFn
    const defaultPath = () => aFn = pathTo(action, actionModules)
    // console.log(":::", contextType, ctxPath, ctxSym)

    switch (contextType) {
      case 'ƒ':
        let contextPath = ctxPath.split(".")
        contextPath.pop()
        let modulePath = []
        contextPath.some((p, i) => {
          modulePath.push(p)
          aFn = pathTo(`${modulePath.join(".")}.${action}`, actionModules)
        })
        if (!aFn) {
          defaultPath()
        } else {
          let mp = modulePath.join(".")
          log = ` 𝜶' ${mp}.(${action} ← ${contextType} ${ctxPath.replace(mp + ".", "")}) ${ctxSym}`
        }
        break
      default :
        defaultPath()
    }

    Aloger.group(log, params)

    if (!aFn) {
      console.warn(" ↓  ↓  Action not found ↓")
      console.warn(log)
      return Promise.resolve(false)
    } else {
      let maybePromise = aFn.apply({ a:dispatchAction("𝗔."+action), f: graph.flow }, params)
      if (maybePromise && typeof maybePromise.then === 'function') {
        GlobalState.setRun(action, true)
        return new Promise(((resolve, reject) => {
          maybePromise.then(r => {
            GlobalState.setRun(action, false)
            resolve(r)
          }).catch(e => {
            GlobalState.setRun(action, false)
            reject(e)
          })
        }))
      }
      return maybePromise
    }
  }
  if (contextType == 'ui') {
    let o = GlobalState.data
    o.launch = launch
    return o
  } else {
    return launch
  }
}


const runEntity = A.flow
runEntity.on(app => {
  let entry = actionModules['entry']
  if (entry) {
    Aloger.simple(" 𝜶  ← root.entry")
    entry(app)
  }
})
export const actions = {
  newDispatcher: dispatchAction,
  runEntity,
  get modules(){
    return actionModules
  },
  set(v, flow) {
    let ctx = webPackActions(v)
    if (ctx) {
      actionModules = ctx(dispatchAction("𝗔"), flow)
    } else {
      actionModules = v(dispatchAction("𝗔"), flow)
    }
  }
}