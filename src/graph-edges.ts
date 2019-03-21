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
  for (let [action, flow] of graph.edges.wrap) {
    let w = getCtxAction(action, flow.id, `wrap ∴`)
    flow.wrap(v=>getCtxAction(action, flow.id, `wrap ∴`)(v))
  }
  // Create On Edges
  for (let [paths, action, flow] of graph.edges.from) {
    let targets = []
    let haveV = {}

    const getValues = () => targets.map(f=>f.v)
    const exec = path => {
      let f = getFlow(path, flow)
      targets.push(f)
      haveV[path] = false
      const mutator = mutateFlowFromAction(`from ∴`, action,  flow)
      subscribe(f, () => {
        f.on(function(){
          haveV[path] = true
          if (Object.keys(haveV).every(k=>haveV[k])){
            f.off(this)
            f.on(()=>mutator(...getValues()))
          }
        })
      })
    }

    if (Array.isArray(paths)){
      paths.forEach(v=>haveV[v] = false)
      paths.forEach(exec)
    } else {
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
