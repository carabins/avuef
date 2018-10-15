import {InstallAlak} from "./install-alak";
import {PluginObject} from "vue";
import * as alak from "alak";
import {graphNodes} from "./graph-nodes";
import {graphEdges} from "./graph-edges";
import {actions} from "./actions";
import {graph} from "./graph";
import {installMixin} from "./install-mixin";
import {webPackActions} from "./wp-context";
import {vuex} from "./vuex";
import {Aloger} from "./logger";


InstallAlak()

export const A = alak.A
export const wpFlolderActions = webPackActions




export class AVue<A, F> implements PluginObject<A> {
  vuex = vuex
  kit = alak.A.flow
  f: A
  a: Function

  private stateClass: A
  private actionModules: F
  public edgeClass: {
  }

  constructor(options: {
    FlowStore: A,
    actionModules?: F,
    edges?: any,
    silent?: boolean
  }) {
    if (options.FlowStore) {
      this.stateClass = options.FlowStore
    } else {
      throw "𝗔vueƒ FlowStore not defined"
    }
    if (options.silent) {
      Aloger.silent()
    }
  }

  install(_Vue, options) {
    Aloger.simple("𝗔vueƒ ")
    graphNodes(this.stateClass)
    actions.set(this.actionModules, graph.flow)
    if (!this.options.prioritySchema) {
      actions.runEntity.on(v => graphEdges())
    } else {
      graphEdges()
    }
    this.f = graph.flow
    _Vue.prototype.$f = graph.flow
    _Vue.prototype.$a = actions.newDispatcher("ui")
    _Vue.mixin(installMixin)
    let a = actions.newDispatcher("𝗔")
    this.a = a
    this.kit({f: graph.flow, a})
    actions.runEntity(options)
  }

  [key: string]: any;

}