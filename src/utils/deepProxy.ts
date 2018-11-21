import {wayTo} from "./index";
import {graph} from "../graph";
import {actions} from "../actions";
import {Aloger} from "../logger";


const deepFlow = {
  apply(p, ctx, args) {
    // console.log("apply", p.path)
    let f = wayTo(p.path, graph.flow)
    if (!f) throw `flow → ${p.path} not found ← ${p.ctx}`
    f.o.lc = p.ctx
    f(...args)
    return f
  },
  get(p, k) {
    switch (k) {
      case "v":
      case "on":
      case "mutate":
        if (!p.f)
          throw `flow.${k} "${p.path.join(".")}" not found in ${p.ctx}`
        else return p.f[k]
    }
    p.path.push(k)
    p.f = wayTo(p.path, graph.flow)
    return p.q
    // if (p.f) return p.f
    // else return p.q
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
    // let a = wayTo(p.path, actions.modules)
    let actionName = p.path.join(".")
    let promise = actions.launch(actionName, p.ctx, ...args)
    // promise.catch(v=>{
    //   console.error(v)
    // })

    // console.log(promise)
    return promise
  },
  get(p, k) {
    // console.log("←←←←", k)
    if (!fnProps.has(k)){
      p.path.push(k)
      return p.q
    }
    // p.f = wayTo(p.path, actions.modules)
    // if (p.f) return p.f

  }
}
//
export const contextAction = ctx => {
  // console.log("contextAction", ctx)

  return new Proxy(Object.assign(fn,{ctx}), {
    apply(o, __, args) {
      let actionName = args.shift()

      return actions.launch(actionName, ctx,...args)
    },
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
        ctx,
        path: [k],
      } as any
      p.q = new Proxy(fn, deepAction)
      Object.assign(fn, p)
      return p.q
    }
  })
}