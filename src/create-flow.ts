import {alakProps} from './NodeFlowDsl'
import {addEdge} from './add-edges'
import {A} from 'alak'
import {LoStorage} from "./utils/LoStorage";

const createFlow = (node, name, m) => {
  let flow = A.f
  // let store = flow.isMeta('stored')
  // if (store) LoStorage.restoreFlow(flow.id, flow)
  node.props.forEach(k => {
    if (alakProps.has(k)) {
      flow[k]()
    } else {
      flow.meta(k)
    }
  })
  let store = flow.isMeta('stored')
  if (store) LoStorage.restoreFlow(flow.id, flow)

  Object.keys(node.methods).forEach(k => {
    let v = node.methods[k]
    switch (k) {
      case 'start':
        if (!store && !flow.v) {
          flow.setMetaObj({
            lc: 'ℵ'
          })
          flow(...v)
        }
        break
      case 'value':
        if (!store && !flow.v)
          flow.silent(...v)
        break
    }
  })



  let id = m+"."+name
  // console.log({id})

  flow.setId(id)
  // let cmd = flow.isMeta('immutable') ? 'im' : 'on'


  let metaObj = {
    m: m,
    name,
    path: [m, name]
  }
  // console.log(metaObj)


  if (flow.o) Object.assign(metaObj, flow.o)
  flow.setMetaObj(metaObj)



  Object.keys(node.edges).forEach(edgeName => {
    let edgeArgs = node.edges[edgeName]
    addEdge(edgeName, edgeArgs, flow)
  })
  return flow
}
let lastModule = ""
export const createFlowNode = o => {
  let node = {}
  Object.keys(o).forEach(name => {
    let n = o[name]
    if (n.isNode) {
      // console.log("node", name)
      node[name] = createFlow(n, name, lastModule)
    } else {
      lastModule = n
      // console.log("lastModule", name)
      lastModule = name
      node[name] = createFlowNode(n)
    }
  })
  return node
}
