"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const option_mapflow_1 = require("./option-mapflow");
const option_on_flow_1 = require("./option-on-flow");
const mapCleaner = new Map();
const onCleaner = new Map();
const toData = new WeakMap();
const clearCleaner = (v, t) => {
    if (v.has(t)) {
        v.get(t)();
        v.delete(t);
    }
};
exports.installMixin = {
    data() {
        if (toData.has(this))
            return toData.get(this);
        return {};
    },
    beforeCreate() {
        let mapFlowOptions = this.$options.mapFlow;
        if (mapFlowOptions) {
            option_mapflow_1.optionMapflow(mapCleaner, this, toData, mapFlowOptions);
        }
    },
    created() {
        let onFlowOptions = this.$options.onFlow;
        if (onFlowOptions) {
            option_on_flow_1.optionOnFlow(onCleaner, this, onFlowOptions);
        }
    },
    beforeDestroy() {
        clearCleaner(mapCleaner, this);
        clearCleaner(onCleaner, this);
    }
};
