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


export class AVue<T> implements PluginObject<T> {
  kit = alak.A.flow
  f: T
  a: Function
  // schemaClass
  // actionModules
  constructor(private schemaClass, private actionModules, private options:any = {}) {
    if (options.silent){
      Aloger.silent()
    }
  }
  vuex = vuex
  install(_Vue, options) {
    Aloger.simple("𝗔vue ƒlows")
    graphNodes(this.schemaClass)
    actions.set(this.actionModules, graph.flow)
    if (!this.options.prioritySchema) {
      actions.runEntity.on(v=>graphEdges())
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