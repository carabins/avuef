"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const global_state_1 = require("./global-state");
const wp_context_1 = require("./wp-context");
const alak_1 = require("alak");
let actionModules = {};
function dispatchAction(...context) {
    let [contextType, ctxPath, ctxSym] = context;
    const launch = (action, ...params) => {
        let log = ` 𝜶  ${action} ← ${contextType} ${ctxPath ? ctxPath : ""} ${ctxSym ? ctxSym : ''}`;
        let aFn;
        const defaultPath = () => aFn = utils_1.pathTo(action, actionModules);
        // console.log(":::", contextType, ctxPath, ctxSym)
        switch (contextType) {
            case 'ƒ':
                let contextPath = ctxPath.split(".");
                contextPath.pop();
                let modulePath = [];
                contextPath.some((p, i) => {
                    modulePath.push(p);
                    aFn = utils_1.pathTo(`${modulePath.join(".")}.${action}`, actionModules);
                });
                if (!aFn) {
                    defaultPath();
                }
                else {
                    let mp = modulePath.join(".");
                    log = ` 𝜶' ${mp} ⋃ ${action} ← ${contextType} ${ctxPath.replace(mp + ".", "")} ${ctxSym}`;
                }
                break;
            default:
                defaultPath();
        }
        if (params.length > 1) {
            console.groupCollapsed(log);
            console.log(params);
            console.groupEnd();
        }
        else {
            console.log(log);
        }
        if (!aFn) {
            console.warn(" ↑  ⬆  Action not found ⬆  ");
            return Promise.resolve(false);
        }
        else {
            let maybePromise = aFn(...params);
            if (maybePromise && typeof maybePromise.then === 'function') {
                global_state_1.GlobalState.setRun(action, true);
                return new Promise(((resolve, reject) => {
                    maybePromise.then(r => {
                        global_state_1.GlobalState.setRun(action, false);
                        resolve(r);
                    }).catch(e => {
                        global_state_1.GlobalState.setRun(action, false);
                        reject(e);
                    });
                }));
            }
            return maybePromise;
        }
    };
    if (contextType == 'ui') {
        let o = global_state_1.GlobalState.data;
        o.launch = launch;
        return o;
    }
    else {
        return launch;
    }
}
const runEntity = alak_1.A.flow;
runEntity.on(app => {
    let entry = actionModules['entry'];
    if (entry) {
        console.log(" 𝜶  ← root.entry");
        entry(app);
    }
});
exports.actions = {
    newDispatcher: dispatchAction,
    runEntity,
    get modules() {
        return actionModules;
    },
    set(v, flow) {
        let ctx = wp_context_1.webPackActions(v);
        if (ctx) {
            actionModules = ctx(dispatchAction("Ω"), flow);
        }
        else {
            actionModules = v(dispatchAction("Ω"), flow);
        }
    }
};
