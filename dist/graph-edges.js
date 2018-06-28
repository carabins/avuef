"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
const graph_1 = require("./graph");
const utils_1 = require("./utils");
// const getFullPath = (p, flow) => {
//   let a = p.split(".")
//   if (a.length == 1) {
//     p = flow.o.m + p
//   }
//   return p
// }
const getFlow = (path, flow) => {
    let a = path.split(".");
    let f;
    if (a.length == 1) {
        f = utils_1.pathTo(flow.o.m + "." + path, graph_1.graph.flow);
        if (f)
            return f;
        f = graph_1.graph.flow[path];
        if (f)
            return f;
    }
    else {
        return utils_1.pathTo(path, graph_1.graph.flow);
    }
    console.error("Edge Flow Not Found:", path, "in", flow.o.path.join("."), "schema");
};
const normalizeFlowPath = (path, flow) => {
    let a = path.split(".");
    if (a.length == 1 && !graph_1.graph.flow[path]) {
        path = flow.o.m + "." + path;
    }
    return path;
};
const initTypeGuard = (defaultValue, flow) => {
    if (defaultValue) {
        flow(defaultValue);
        return typeof defaultValue;
    }
    return false;
};
const actionRunners = {};
const initActionMutator = (sym, action, typeGuard, flow) => (value) => __awaiter(this, void 0, void 0, function* () {
    let ar = actions_1.actions.newDispatcher('ƒ', flow.id, sym); //actionRunners[name]
    // if (!ar) {
    //   ar = actionRunners[name] = actions.newDispatcher(name)
    // }
    const safe = v => {
        if (typeGuard && typeGuard != typeof v) {
            console.warn(`Mismatch type for "${flow.id}" flow lazyGet action '${action}'`);
        }
        else {
            flow(v);
        }
    };
    if (value !== null) {
        let r = yield ar(action, value);
        flow(r);
    }
    else {
        flow(null);
    }
});
const subscribe = (flow, fn) => {
    if (flow.isMeta('lazy')) {
        graph_1.graph.lazyActions.set(flow, () => {
            if (!flow.isMeta('subscribed')) {
                flow.meta('subscribed');
                fn();
            }
        });
    }
    else {
        fn();
    }
};
function graphEdges() {
    // Create if Edges
    for (let [path, exp, action, to] of graph_1.graph.edges.if) {
        let flow = getFlow(path, to);
        flow.on(v => {
            if (v == exp) {
                actions_1.actions.newDispatcher('ƒ', to.id, '⋁ ∴')(action)
                    .then(r => {
                    to(r);
                });
            }
        });
    }
    // Create get Edges
    for (let [action, defaultValue, flow] of graph_1.graph.edges.get) {
        let typeGuard = initTypeGuard(defaultValue, flow);
        let mutator = initActionMutator(`↓ ∴`, action, typeGuard, flow);
        subscribe(flow, mutator);
    }
    // Create On Edges
    for (let [path, action, defaultValue, flow] of graph_1.graph.edges.on) {
        let typeGuard = initTypeGuard(defaultValue, flow);
        let f = getFlow(path, flow);
        const mutator = initActionMutator(`← ∴`, action, typeGuard, flow);
        subscribe(flow, () => f.on(mutator));
    }
    // Create Mapped Edges
    for (let [path, action, flow] of graph_1.graph.edges.map) {
        let f = getFlow(path, flow);
        const mutator = (ar) => __awaiter(this, void 0, void 0, function* () {
            console.log(" ∑ ", action);
            let a = ar.map(a => [a]);
            for (let i = 0; i < ar.length; i++) {
                const v = ar[i];
                a[i][1] = yield actions_1.actions.newDispatcher('ƒ', flow.id, '⇇ ∴')(action, v);
            }
            flow(a);
        });
        subscribe(flow, mutator);
    }
}
exports.graphEdges = graphEdges;
