import {A, AFlow} from "alak";
import {graph} from "./graph";
import {addEdge} from "./add-edges";

const ext = new Set(["valueOf"])

const alakProps = new Set(["stateless", "emitter"])
const allowEdges = new Set(["lazyGet", "get", "map", "lazyMap", "on", "lazyOn", "if", "action"])


const createFlow = node => {
  let flow = A.f
  Object.keys(node.edges).forEach(edgeName => {
    let edgeArgs = node.edges[edgeName]
    addEdge(edgeName, edgeArgs, flow)
  })
  if (node.v) {
    flow.silent(...node.v)
    flow.setMetaObj({
      lc: "hardcoded",
    })
  }

  node.meta.forEach(k => {
    if (alakProps.has(k)) {
      flow[k]()
    } else {
      flow.meta(k)
    }
  })
  return flow
}

export const createFlowNode = o => {
  let node = {}
  Object.keys(o).forEach(name => {
    let n = o[name]
    if (n.isNode) {
      node[name] = createFlow(n)
    } else {
      node[name] = createFlowNode(n)
    }
  })
  return node
}


const deepHandler = {
  get(target, key) {
    let meta = target.meta as Set<any>
    switch (key) {
      case "meta":
        return Array.from(meta.values())
      case "edges":
        return target.edges
      case "v":
        return target.v
      case "isNode":
        return true
    }
    let edges = target.edges


    switch (typeof key) {
      case "string" :
        if (allowEdges.has(key)) {
          return (...args) => {
            edges[key] = args
            return target.deep
          }
        } else if (!meta.has(key) && !ext.has(key)) {
          target.meta.add(key)
        }
        break

    }
    return target.deep
  }
}

const startHandler = {
  get(__, key) {
    let fn: any = (...args) => {
      fn.v = args
      return fn.deep
    }
    __.fn = fn
    fn.fn = fn
    fn.meta = new Set()
    fn.edges = {}
    fn.deep = new Proxy(fn, deepHandler)
    return fn.deep[key]
  }
}

function iceberg(...args) {
  return this.fn(...args)
}

export const flowConstructor = new Proxy(iceberg, startHandler)

