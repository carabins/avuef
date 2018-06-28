"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const utils_1 = require("./utils");
exports.optionMapflow = (mapCleaner, comp, toData, params) => {
    let cleanFns = [];
    let dataObject = {};
    let compName = comp._componentTag;
    const mutatePatch = (fullPath, targetKey) => {
        let path = fullPath.split('.');
        let mutatePath = graph_1.graph.mutations;
        path.forEach(p => {
            if (mutatePath[p]) {
                mutatePath = mutatePath[p];
            }
        });
        if (!mutatePath.add) {
            console.warn(`[mutatePath] '${fullPath}' not found in`, compName);
            return;
        }
        let mutator = (value = undefined) => {
            let { flow, isFullPatch, lastI } = utils_1.getFlowData(path, graph_1.graph.flow, value);
            if (flow.isMeta("lazy")) {
                // console.log("Ω", graphEdges.lazyEdges.has(flow), graphEdges.lazyEdges.get(flow), fullPath)
                if (graph_1.graph.lazyActions.has(flow))
                    graph_1.graph.lazyActions.get(flow)(`𝝭' ` + compName);
            }
            // if (value != null) {
            value = value ? value : flow[flow.isMeta("mutable") ? "v" : "imv"];
            // }
            if (!isFullPatch) {
                let missPath = path.slice(lastI);
                if (value)
                    missPath.forEach(p => {
                        value = value[p];
                    });
            }
            // console.log("Ω",fullPath, toData.has(comp),  value)
            if (toData.has(comp)) {
                comp.$set(comp, targetKey, value);
            }
            else {
                comp[targetKey] = dataObject[targetKey] = value;
            }
        };
        mutator();
        mutatePath.add(mutator);
        cleanFns.push(() => mutatePath.delete(mutator));
    };
    Object.keys(params).forEach(k => {
        let pValue = params[k];
        let typeOfParams = Array.isArray(pValue) ? "array" : typeof pValue;
        switch (typeOfParams) {
            case "string":
                mutatePatch(pValue, k);
                break;
            case "array":
                // console.log("array")
                let flow = graph_1.graph.flow[k];
                if (flow) {
                    if (pValue.length == 0)
                        pValue = Object.keys(flow);
                    pValue.forEach(v => {
                        mutatePatch(k + "." + v, v);
                    });
                }
                else {
                    console.warn(`Flow "${k}" not found for component: '${compName}'`);
                }
                break;
        }
    });
    mapCleaner.set(comp, () => {
        cleanFns.forEach(f => f());
        // toData.delete(comp)
    });
    // Object.assign(comp, dataObject)
    toData.set(comp, dataObject);
    return dataObject;
};
