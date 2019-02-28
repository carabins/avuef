import {actions} from "./actions";
import {graph} from "./graph";
import {pathTo} from "./utils";
import {Aloger} from "./logger";
import {contextAction} from "./utils/deepProxy";


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
function getCtxAction (action, name, sym) {
  let a = contextAction(name, sym)
  let p = action.split(".")
  let aFn = a[p.shift()]
  p.forEach(k=>aFn=aFn[k])
  // console.log("→→ getCtxAction")
  return aFn
}

const mutateFlowFromAction = (sym, action, flow) => {
  return async (...value) => {
    let aFn = getCtxAction(action, flow.id, sym)
    if (value.length>0) {
      // console.log("→→→→→ set CtxAction", action, flow.id)
      // console.log("afn", aFn.callerName)
      let r = await aFn(...value)
      flow.o.lc = `${action} 𝜶 ∴`
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

  // Create get Edges
  for (let [action, flow] of graph.edges.actions) {
    flow.on((...v) => {
      getCtxAction(action, flow.id, "ƒ ∴")(...v)
    })
  }
  for (let [action, flow] of graph.edges.get) {
    let mutator = mutateFlowFromAction(`ƒ get ∴`, action, flow)
    subscribe(flow, mutator)
  }


  // Create
  for (let [action, flow] of graph.edges.fx) {
    subscribe(flow, () => {
      flow.effect(v=>getCtxAction(action, flow.id, `effect ∴`)(v), true)
    })
  }
  // Create On Edges
  for (let [paths, action, flow] of graph.edges.from) {
    let targets = []
    let count = 0
    let countN = 0
    const getValues = () => targets.map(f=>f.v)
    const exec = path => {
      let f = getFlow(path, flow)
      targets.push(f)
      const mutator = mutateFlowFromAction(`from ∴`, action,  flow)
      subscribe(f, () => {
        count++
        f.on(()=>{
          if (count>=countN){
            mutator(...getValues())
          }
        })
      })
    }
    if (Array.isArray(paths)){
      countN = paths.length
      paths.forEach(exec)
    } else {
      countN = 0
      exec(paths)
    }
  }

  // Create Mapped Edges
  for (let [path, action, flow] of graph.edges.map) {
    let f = getFlow(path, flow)
    const mutator = async ar => {
      Aloger.simple(" ∑ "+ action)
      let a = ar.map(a => [a])
      for (let i = 0; i < ar.length; i++) {
        const v = ar[i];
      }
      flow(a)
    }
    subscribe(flow, mutator)
  }
}
