"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graph = {
    flow: {},
    mutations: {},
    lazyActions: new WeakMap(),
    edges: {
        map: [],
        if: [],
        get: [],
        on: []
    }
};
