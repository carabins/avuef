import {pathTo, wayTo} from "./index";
import {graph} from "../graph";
import {actions} from "../actions";
import {Aloger} from "../logger";


const updateFlowByPath = (ctx, path, v) =>{
  let f = wayTo(path, graph.flow)
  if (!f) throw `flow → ${path} not found ← ${ctx}`
  f.o.lc = ctx
  f(v)
  return f
}

const deepFlow = {
  apply(p, ctx, args) {
    return updateFlowByPath(p.ctx, p.path, args[0])
  },
  get(p, k) {
    switch (k) {
      case "v":
      case "on":
      case "im":
      case "off":
      case "emit":
      case "match":
      case "silent":
      case "mutate":
        if (!p.f)
          throw `flow.${k} "${p.path.join(".")}" not found in ${p.ctx}`
        else return p.f[k]
    }
    p.path.push(k)
    p.f = wayTo(p.path, graph.flow)
    return p.q
  }
}

export const contextFlowPath = ctx1 => (path, value, ctx2) => {
  if (value) {
    let ctx = ctx2 ? ctx2 : ctx1
    return updateFlowByPath(ctx, path.split("."), value)
  } else {
    return pathTo(path, graph.flow)
  }
}

let fn = () => {
}
export const contextFlow = ctx => {
  return new Proxy(graph.flow, {
    apply(o, __, args) {
      return graph.flow(ctx, ...args)
    },
    get(o, k) {

      if (typeof k === "symbol"){
        return hint => {
          return "Flow Proxy"
        }
      }
      let p = {
        ctx,
        path: [k],
        f: wayTo([k], graph.flow)
      } as any
      p.q = new Proxy(fn, deepFlow)
      Object.assign(fn, p)
      return p.q
    }
  })
}


const fnProps = new Set<any>(["call", "constructor", "prototype"])
const deepAction = {
  apply(p, ctx, args) {
    let actionName = p.path.join(".")
    let promise = actions.launch(actionName, p.callerName, p.sym, ...args)
    return promise
  },
  get(p, k) {
    if (!fnProps.has(k)){
      p.path.push(k)
      return p.q
    }
  }
}
export const contextAction = (callerName, sym) => {

  return new Proxy(Object.assign(fn,{callerName}), {
    get(o, k) {
      if (typeof k === "symbol"){
        return hint => {
          return "Action Proxy"
        }
      }
      if (fnProps.has(k)){
        return {}
      }
      let p = {
        callerName,
        sym,
        path: [k],
      } as any
      p.q = new Proxy(fn, deepAction)
      Object.assign(fn, p)

      return p.q
    }
  })
}
