import {actions} from "./actions";
import {graph} from "./graph";
import {pathTo} from "./utils";
import {Aloger} from "./logger";
import {contextAction} from "./utils/deepProxy";
import {clearLine} from "readline";


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
  console.error(flow.o.path.join(".")+"."+path, "← Flow NOT FOUND, check edges in flowgraph")

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


const lazySubscribe = (flow, fn) => {
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


  for (let [action, flow] of graph.edges.bind) {
    flow.on((...v) => {
      getCtxAction(action, flow.id, "ƒ ∴")(...v)
    })
  }
  for (let [action, flow] of graph.edges.born) {
    let mutator = mutateFlowFromAction(`ƒ get ∴`, action, flow)
    lazySubscribe(flow, mutator)
  }


  // Create
  for (let [action, flow] of graph.edges.wrap) {
    let w = getCtxAction(action, flow.id, `wrap ∴`)
    flow.wrap(v=>getCtxAction(action, flow.id, `wrap ∴`)(v, flow.v))
  }

  for (let [paths, action, flow] of graph.edges.in) {

    if (Array.isArray(paths)){
      let flows = paths.map(path=>getFlow(path, flow))
      lazySubscribe(flow, ()=>{
        flow.integralMix(flows,  (...a)=>{
          flow.o.lc = `${action} 𝜶 mix ∴`;
          return getCtxAction(action, flow.id, `mix ∴`)(...a)
        })
      })
    } else {
      let f = getFlow(paths, flow)
      const mutator = mutateFlowFromAction(`from ∴`, action,  flow)
      lazySubscribe(flow, ()=>{
        f.on(v=>{
          flow(mutator(v))
        })
      })
    }
  }


}
