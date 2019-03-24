import {A, AFlow} from "alak";
import {graph} from "./graph";
import {actions} from "./actions";

export const addEdge = (name, args, flow, path) => {
  const add = (edges, ...meta) => {
    if (meta)
      meta.forEach(flow.meta)
    args.push(flow)
    edges.push(args)
  }
  switch (name) {
    case "bind" :
      add(graph.edges.bind)
      break
    case "wrap" :
      add(graph.edges.wrap)
      break
    case "born" :
      add(graph.edges.born)
      break
    case "in" :
      add(graph.edges.in)
      break
    case "out" :
      add(graph.edges.out)
      break
  }
}

