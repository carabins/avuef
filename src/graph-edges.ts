import {actions} from "./actions";
import {graph} from "./graph";
import {pathTo} from "./utils";
import {Aloger} from "./logger";
import {contextAction} from "./utils/deepProxy";


// const getFullPath = (p, flow) => {
//   let a = p.split(".")
//   if (a.length == 1) {
//     p = flow.o.m + p
//   }
//   return p
// }
const getFlow = (path, flow) => {
  let a = path.split(".")
  let f
  if (a.length == 1) {
    f = pathTo(flow.o.m + "." + path, graph.flow)
    if (f) return f
    f = graph.flow[path]
    if (f) return f
  } else {
    return pathTo(path, graph.flow)
  }
  console.error("Edge Flow Not Found:", path, "in", flow.o.path.join("."), "schema")

}
// const normalizeFlowPath = (path, flow) => {
//   let a = path.split(".")
//   if (a.length == 1 && !graph.flow[path]) {
//     path = flow.o.m + "." + path
//   }
//   return path
// }
//
// const actionRunners = {}
const getCtxAction = (action, name, sym) => {
  let a = contextAction(name, sym)
  let p = action.split(".")
  let aFn = a[p.shift()]
  p.forEach(k=>aFn=aFn[k])
  return aFn
}
const mutateFlowFromAction = (sym, action, flow) => {
  let aFn = getCtxAction(action, flow.id, sym)
  return async value => {
    if (value !== null) {
      let r = await aFn(value)
      // console.log(aFn.q)
      flow.o.lc = `∴ ${action}`
      flow(r)
    } else {
      flow(null)
    }
  }
}


const subscribe = (flow, fn) => {
  if (flow.isMeta('lazy')) {
    graph.lazyActions.set(flow, () => {
      if (!flow.isMeta('subscribed')) {
        flow.meta('subscribed')
        fn()
      }
    })
  } else {
    fn()
  }
}

export function graphEdges() {
  // Create if Edges
  // for (let [path, exp, action, to] of graph.edges.if) {
  //   let flow = getFlow(path, to)
  //   // let act = contextAction()
  //   flow.on(v => {
  //     if (v == exp) {
  //       // contextAction()
  //       // actions.newDispatcher('ƒ', to.id, '∴ if')(action)
  //       //   .then(r => {
  //       //     to(r)
  //       //   })
  //     }
  //   })
  // }

  // Create get Edges
  for (let [action, flow] of graph.edges.actions) {
    flow.on((...v) => {
      getCtxAction(action, flow.id, "∴")(...v)
    })
  }
  for (let [action, defaultValue, flow] of graph.edges.get) {
    let mutator = mutateFlowFromAction(`∴`, action, flow)
    subscribe(flow, mutator)
  }


  // Create On Edges
  for (let [path, action, defaultValue, flow] of graph.edges.on) {
    let f = getFlow(path, flow)
    const mutator = mutateFlowFromAction(`∴`, action,  flow)
    subscribe(f, () => f.on(mutator))
  }

  // Create Mapped Edges
  for (let [path, action, flow] of graph.edges.map) {
    let f = getFlow(path, flow)
    const mutator = async ar => {
      Aloger.simple(" ∑ "+ action)
      let a = ar.map(a => [a])
      for (let i = 0; i < ar.length; i++) {
        const v = ar[i];
        // a[i][1] = await actions.newDispatcher('ƒ', flow.id, '⇇ ∴')(action, v)
      }
      flow(a)
    }
    subscribe(flow, mutator)
  }
}
