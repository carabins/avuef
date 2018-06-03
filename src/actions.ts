import {pathTo} from "./utils";
import {GlobalState} from "./global-state";
import {webPackActions} from "./wp-context";


let actionModules = {}
const dispatchAction = (...context) => {
  let [contextType, ctxPath, ctxSym] = context

  const launch = (action, ...params) => {
    let log = ` 𝜶  ${action} ← ${contextType} ${ctxPath} ${ctxSym ? ctxSym : ''}`
    let aFn
    const defaultPath = () => aFn = pathTo(action, actionModules)
    switch (contextType) {
      case 'ƒ':
        // let actionPath = action.split(".")
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
          log = ` 𝜶' ${mp} ⋃ ${action} ← ${contextType} ${ctxPath.replace(mp + ".", "")} ${ctxSym}`
        }
        break
      default :
        defaultPath()
    }


    if (params.length > 1) {
      console.groupCollapsed(log)
      console.log(params)
      console.groupEnd()
    } else {
      console.log(log)
    }

    if (!aFn) {
      console.warn(" ↑  ⬆  Action not found ⬆  ")
      return Promise.resolve(false)
    } else {
      let maybePromise = aFn(...params)
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

export const actions = {
  newDispatcher: dispatchAction,
  runEntity(app) {
    let entry = actionModules['entry']
    if (entry) {
      console.log(" 𝜶  ← root.entry")
      entry(app)
    }
  },
  set(v, flow) {
    let ctx = webPackActions(v)
    if (ctx){
      actionModules = ctx(dispatchAction("Ω"), flow)
    } else {
      actionModules = v(dispatchAction("Ω"), flow)
    }

  }
}