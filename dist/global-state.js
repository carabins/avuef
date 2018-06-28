"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const V2 = require("vue");
let Vue = vue_1.default ? vue_1.default : V2;
// let wm // = V1 ? V1 : V2
const wm = new Vue({
    data: {
        during: {},
        state: {}
    }
});
exports.GlobalState = {
    data: wm,
    setRun: (key, value) => {
        let o = wm.$data.during;
        wm.$set(wm, 'during', Object.assign({}, o, { [key]: value }));
    },
    setState: (key, value) => {
        let o = wm.$data.state;
        wm.$set(wm, 'state', Object.assign({}, o, { [key]: value }));
    },
};
