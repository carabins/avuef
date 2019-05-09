import { addEdge } from './add-edges'

import { A } from 'alak'

export function createEdges(storeModules) {
  Object.keys(storeModules).forEach(k => {
    let q = storeModules[k].edges
    if (q) {
      let flow = A.f
      flow.setId(k)
      console.log(q)
      q.forEach(e => addEdge('top', [e], flow))
    }
  })
}
