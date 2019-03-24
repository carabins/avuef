import {A, AFlow} from "alak";
import {graph} from "./graph";
import {addEdge} from "./add-edges";
import {observableValue} from "./global-state";

const ext = new Set(["valueOf"])

const alakProps = new Set(["stateless", "emitter", "immutable"])
const allowEdges = new Set(
  ["born","wrap", "bind", "in", "out"]
)


const createFlow = (node, name) => {
  let flow = A.f

  let startValue = node.val
  if (startValue) {
    startValue.forEach(observableValue)
    flow(...startValue)
    flow.setMetaObj({
      lc: "init",
    })
  }

  node.meta.forEach(k => {
    if (alakProps.has(k)) {
      flow[k]()
    } else {
      flow.meta(k)
    }
  })

  Object.keys(node.edges).forEach(edgeName => {
    let edgeArgs = node.edges[edgeName]
    addEdge(edgeName, edgeArgs, flow, name)
  })
  return flow
}

export const createFlowNode = o => {
  let node = {}
  Object.keys(o).forEach(name => {
    let n = o[name]
    if (n.isNode) {
      node[name] = createFlow(n, name)
    } else {
      node[name] = createFlowNode(n)
    }
  })
  return node
}


const deepHandler = {
  get(target, key) {
    if (key=="value") key = "v"
    let meta = target.meta as Set<any>
    switch (key) {
      case "meta":
        return Array.from(meta.values())
      case "edges":
        return target.edges
      case "val":
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
        } else if (!meta.has(key) && !ext.has(key) && key != "v") {
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

