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
    case "fx" :
    case "effect" :
      add(graph.edges.fx)
      break
    case "lazyGet" :
      add(graph.edges.get, "lazy")
      break
    case "get" :
      add(graph.edges.get)
      break
    case "mapEdge" :
      add(graph.edges.map)
      break
    case "lazyMapEdge" :
      add(graph.edges.map, "lazy")
      break
    case "edge" :
    case "from" :
      add(graph.edges.from)
      break
    case "lazyFrom" :
    case "lazyEdge" :
      add(graph.edges.from, "lazy")
      break
    case "if" :
      add(graph.edges.if, "if")
      break
    case "lazyAction" :
    case "lazyA" :
      add(graph.edges.actions, "lazy")
      break
    case "a" :
    case "call" :
    case "action" :
      add(graph.edges.actions)
      break
  }
}

