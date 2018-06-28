"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const install_alak_1 = require("./install-alak");
const vue_1 = require("vue");
const alak = require("alak");
const graph_nodes_1 = require("./graph-nodes");
const graph_edges_1 = require("./graph-edges");
const actions_1 = require("./actions");
const graph_1 = require("./graph");
const install_mixin_1 = require("./install-mixin");
const wp_context_1 = require("./wp-context");
const vuex_1 = require("./vuex");
install_alak_1.InstallAlak();
exports.A = alak.A;
exports.wpFlolderActions = wp_context_1.webPackActions;
class AVue extends vue_1.PluginObject {
    constructor(schemaClass, actionModules, runSchemaAfterVueInstall = true) {
        super();
        this.kit = alak.A.flow;
        this.vuex = vuex_1.vuex;
        console.log("𝗔 start");
        graph_nodes_1.graphNodes(schemaClass);
        actions_1.actions.set(actionModules, graph_1.graph.flow);
        if (runSchemaAfterVueInstall) {
            actions_1.actions.runEntity.on(v => graph_edges_1.graphEdges());
        }
        else {
            graph_edges_1.graphEdges();
        }
        this.f = graph_1.graph.flow;
    }
    install(_Vue, options) {
        console.log("𝗔 install vue plugin");
        _Vue.prototype.$f = graph_1.graph.flow;
        _Vue.prototype.$a = actions_1.actions.newDispatcher("ui");
        _Vue.mixin(install_mixin_1.installMixin);
        let a = actions_1.actions.newDispatcher("𝗔");
        this.a = a;
        this.kit({ f: graph_1.graph.flow, a });
        actions_1.actions.runEntity(options);
    }
}
exports.AVue = AVue;
