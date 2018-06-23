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


InstallAlak()

export const A = alak.A
export const wpFlolderActions = webPackActions

export class AVue<T> extends PluginObject<T> {
  kit = alak.A.flow
  f: T
  a: Function
  constructor(schemaClass, actionModules, runSchemaAfterVueInstall = true) {
    super()
    console.log("𝗔 start")
    graphNodes(schemaClass)
    actions.set(actionModules, graph.flow)
    if (runSchemaAfterVueInstall) {
      actions.runEntity.on(v=>graphEdges())
    } else {
      graphEdges()
    }
    this.f = graph.flow
  }
  vuex = vuex
  install(_Vue, options) {
    console.log("𝗔 install vue plugin")
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