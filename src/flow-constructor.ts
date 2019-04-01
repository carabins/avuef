import {A, AFlow} from "alak";
import {graph} from "./graph";
import {addEdge} from "./add-edges";
import {observableValue} from "./global-state";

const ext = new Set(["valueOf"])

const alakProps = new Set(["stateless", "emitter", "immutable"])
const allowMethods = new Set(["value", "start"])
const allowEdges = new Set(
  ["born","wrap", "bind", "in", "out"]
)


const createFlow = (node, name) => {
  let flow = A.f


  Object.keys(node.methods).forEach(k => {
    console.log(k)
    let v = node.methods[k]
    flow.setMetaObj({
      lc: "ℵ",
    })
    switch (k) {
      case "start":
        flow(...v)
        break
      case "value":
        flow.silent(...v)
        break
    }
  })

  node.props.forEach(k => {
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
    switch (key) {
      case "props":
      case "edges":
      case "methods":
        return target[key]
      case "isNode":
        return true
    }
    let edges = target.edges



    switch (typeof key) {
      case "string" :
        if (allowMethods.has(key)) {
          return  (...a) => {
            target.methods[key] = a
            return target.deep
          }
        } else if (allowEdges.has(key)) {
          return (...args) => {
            edges[key] = args
            return target.deep
          }
        } else if (!alakProps.has(key) && !ext.has(key)) {
          target.props.push(key)
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
    fn.props = []
    fn.methods = {}
    fn.edges = {}
    fn.deep = new Proxy(fn, deepHandler)
    return fn.deep[key]
  }
}

function iceberg(...args) {
  return this.fn(...args)
}

export const flowConstructor = new Proxy(iceberg, startHandler)

