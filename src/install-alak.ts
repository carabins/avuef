import {A} from "alak";
import {graph} from "./graph";


export function InstallAlak() {
  const addEdge = (edges, meta?, len?) => (...a) => {
    let f = A.f
    if (len)
      a.length = len
    if (meta)
      f.meta(meta)
    a.push(f)
    edges.push(a)
    return f
  }

  A.install("lazyGet", addEdge(graph.edges.get, "lazy", 2))
  A.install("get", addEdge(graph.edges.get, false, 2))

  A.install("map", addEdge(graph.edges.map))
  A.install("lazyMap", addEdge(graph.edges.map, "lazy"))

  A.install("on", addEdge(graph.edges.on, null, 3))
  A.install("lazyOn", addEdge(graph.edges.on, "lazy", 3))
  A.install("if", addEdge(graph.edges.if, "if", 3))

  // A.install("edges", (edges)=>{
  //   console.log("A.install", edges)
  // })
}
