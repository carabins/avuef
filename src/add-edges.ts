import {graph} from './graph'

export const addEdge = (name, args, flow) => {
  const add = e => e.push([flow, ...args])


  switch (name) {
    case 'bind':
      add(graph.edges.bind)
      break
    case 'wrap':
      add(graph.edges.wrap)
      break
    case 'born':
      add(graph.edges.born)
      break
    case 'in':
      add(graph.edges.in)
      break
    case 'out':
      add(graph.edges.out)
      break
    case 'top':
      add(graph.edges.top)
      break
  }
}
