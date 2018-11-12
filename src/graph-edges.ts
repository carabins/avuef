import {actions} from "./actions";
import {graph} from "./graph";
import {pathTo} from "./utils";
import {Aloger} from "./logger";


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
const mutateFlowFromAction = (sym, action, flow) => async value => {
  if (value !== null) {
    let actionName = `${sym}`
    let r = await actions.launch(action, actionName, value)
    flow.o.lc = `∴ ⇇ 𝜶.${action}`
    flow(r)
  } else {
    flow(null)
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
  for (let [path, exp, action, to] of graph.edges.if) {
    let flow = getFlow(path, to)
    flow.on(v => {
      if (v == exp) {
        actions.newDispatcher('ƒ', to.id, '∴ if')(action)
          .then(r => {
            to(r)
          })
      }
    })
  }

  // Create get Edges
  for (let [action, flow] of graph.edges.actions) {
    flow.on((...v) => {
      let callerName = `∴ action ← ƒ.${flow.id} `
      actions.launch(action, callerName, ...v)
    })
  }
  for (let [action, defaultValue, flow] of graph.edges.get) {
    let mutator = mutateFlowFromAction(`∴ get`, action, flow)
    subscribe(flow, mutator)
  }


  // Create On Edges
  for (let [path, action, defaultValue, flow] of graph.edges.on) {
    let f = getFlow(path, flow)
    const mutator = mutateFlowFromAction(`∴ on ← ƒ.${f.id}`, action,  flow)
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
        a[i][1] = await actions.newDispatcher('ƒ', flow.id, '⇇ ∴')(action, v)
      }
      flow(a)
    }
    subscribe(flow, mutator)
  }
}
