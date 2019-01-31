import {A, AFlow} from "alak";
import {graph} from "./graph";
import {actions} from "./actions";

export const addEdge = (name, args, flow, path) => {

  const add = (edges, meta?, len?) => {
    if (len)
      args.length = len
    if (meta)
      flow.meta(meta)
    args.push(flow)
    edges.push(args)
  }

  switch (name) {
    case "lazyGet" :
      add(graph.edges.get, "lazy", 2)
      break
    case "get" :
      add(graph.edges.get, false, 2)
      break
    case "map" :
      add(graph.edges.map)
      break
    case "lazyMap" :
      add(graph.edges.map, "lazy")
      break
    case "on" :
      add(graph.edges.on, false, 3)
      break
    case "lazyOn" :
      add(graph.edges.on, "lazy", 3)
      break
    case "if" :
      add(graph.edges.if, "if", 3)
      break
    case "lazyA" :
      add(graph.edges.actions, "lazy")
      break
    case "a" :
    case "action" :
      add(graph.edges.actions)
      break
  }
}

