"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alak_1 = require("alak");
const graph_1 = require("./graph");
function InstallAlak() {
    console.log("InstallAlak");
    const addEdge = (edges, meta, len) => (...a) => {
        let f = alak_1.A.f;
        if (len)
            a.length = len;
        if (meta)
            f.meta(meta);
        a.push(f);
        edges.push(a);
        return f;
    };
    alak_1.A.install("lazyGet", addEdge(graph_1.graph.edges.get, "lazy", 2));
    alak_1.A.install("get", addEdge(graph_1.graph.edges.get, false, 2));
    alak_1.A.install("map", addEdge(graph_1.graph.edges.map));
    alak_1.A.install("lazyMap", addEdge(graph_1.graph.edges.map, "lazy"));
    alak_1.A.install("on", addEdge(graph_1.graph.edges.on, null, 3));
    alak_1.A.install("lazyOn", addEdge(graph_1.graph.edges.on, "lazy", 3));
    alak_1.A.install("if", addEdge(graph_1.graph.edges.if, "if", 3));
}
exports.InstallAlak = InstallAlak;
