import {addEdge} from "./add-edges";


import {A} from 'alak'

export function createEdges(storeModules) {
  let edges = {}
  Object.keys(storeModules).forEach(k => {
    let q = storeModules[k].edges
    if (q) {
      let flow = A.f
      flow.setId(k)
      addEdge("top", q, flow)
    }
  })

}
