import {alakProps} from "./NodeFlowDsl";
import {addEdge} from "./add-edges";
import {A} from "alak";

const createFlow = (node, name) => {
  let flow = A.f

  Object.keys(node.methods).forEach(k => {
    let v = node.methods[k]
    switch (k) {
      case "start":
        flow.setMetaObj({
          lc: "ℵ",
        })
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
    addEdge(edgeName, edgeArgs, flow)
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
