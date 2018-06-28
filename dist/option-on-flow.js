"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const utils_1 = require("./utils");
function optionOnFlow(cleaner, comp, params) {
    let offList = [];
    let compName = comp._componentTag;
    Object.keys(params).forEach(k => {
        let f = params[k];
        let flow = utils_1.pathTo(k, graph_1.graph.flow);
        if (flow) {
            if (flow.isMeta("lazy")) {
                if (graph_1.graph.lazyActions.has(flow))
                    graph_1.graph.lazyActions.get(flow)('𝝭 ' + compName);
            }
            let fn = v => f.call(comp, v);
            flow.on(fn);
            offList.push(() => flow.off(fn));
        }
        else {
            console.warn(`${compName}.onFlow ƒ '${k}' flow not found`);
        }
    });
    cleaner.set(this, () => offList.forEach(f => f()));
}
exports.optionOnFlow = optionOnFlow;
