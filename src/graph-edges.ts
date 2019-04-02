import {graph} from './graph'
import {pathTo} from './utils'
import {contextAction} from './utils/deepProxy'

const getFlow = (path, inModule) => {
  let a = path.split('.')
  let f
  if (a.length == 1) {
    f = graph.flowMap[inModule + '.' + path]
    // console.log("f1", inModule, path, !!f)
    if (f) return f
    // console.log(Object.keys(graph.flowMap), inModule + '.' + path)
    // console.log("f2", inModule, path, !!f)
    f = graph.flow[path]
    if (f) return f
  } else {
    return pathTo(path, graph.flow)
  }
  console.error(
    `Flow: ${path} NOT FOUND , check edges in module ${inModule}`
  )
}

function getCtxAction(action, name, sym) {
  let a = contextAction(name, sym)
  let p = action.split('.')
  let aFn = a[p.shift()]
  p.forEach(k => (aFn = aFn[k]))
  // console.log("→→ getCtxAction")
  return aFn
}

const mutateFlowFromAction = (sym, action, flow) => {
  return async (...value) => {
    let aFn = getCtxAction(action, flow.id, sym)
    if (value.length > 0) {
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
  for (let [flow, action] of graph.edges.bind) {
    flow.on((...v) => {
      getCtxAction(action, flow.id, '•')(...v)
    })
  }
  for (let [flow, action] of graph.edges.born) {
    let mutator = mutateFlowFromAction(`•`, action, flow)
    lazySubscribe(flow, mutator)
  }

  // Warp
  for (let [flow, action] of graph.edges.wrap) {
    // let w = getCtxAction(action, flow.id, `wrap ∴`)
    flow.wrap(v => getCtxAction(action, flow.id, `∴`)(v, flow.v))
  }

  // out
  for (let [flow, args] of graph.edges.out) {
    let [action, path] = args.split(' ').filter(l => l.length > 1)
    let f = getFlow(path, flow.o.m)
    lazySubscribe(flow, () => {
      const mutator = mutateFlowFromAction(` ∴`, action, f)
      flow.on(v => {
        mutator(v, f.v, flow.id)
      })
    })
  }

  // in
  graph.edges.in.forEach(([flow, args])=>{
    let [action, ...paths] = args.split(' ').filter(l => l.length > 1)
    if (Array.isArray(paths)) {
      let flows = paths.map(path => getFlow(path, flow.o.m))
      lazySubscribe(flow, () => {
        flow.integralMix(flows, (...a) => {
          flow.o.lc = `${action} ∴`
          return getCtxAction(action, flow.id, ` ∴`)(...a)
        })
      })
    } else {
      let f = getFlow(paths, flow.o.m)
      const mutator = mutateFlowFromAction(` ∴`, action, flow)
      lazySubscribe(flow, () =>
        f.on(mutator)
      )
    }
  })

  graph.edges.top.forEach( ([flow, args])=> {
    let [action, ...paths] = args.split(' ').filter(l => l.length > 1)
    if (Array.isArray(paths)) {
      if (paths.length > 0) {
        let flows = paths.map(path => getFlow(path, flow.id))
        flow.stateless()
        flow.integralMix(flows, (...a)=>{
          a.pop()
          getCtxAction(action, flow.id+".x", `∴`)(...a)
          return true
        })
      } else {
        getCtxAction(action, flow.id+".x", `∴`)()
      }
    }
  })
}
