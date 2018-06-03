import {InstallAlak} from "./install-alak";
import {PluginObject} from "vue";
import * as alak from "alak";
import {graphNodes} from "./graph-nodes";
import {graphEdges} from "./graph-edges";
import {actions} from "./actions";
import {graph} from "./graph";
import {installMixin} from "./install-mixin";


InstallAlak()

export const A = alak.A
export class AVue<T> implements PluginObject<T> {
  kit = alak.A.flow
  f: T
  a: Function

  constructor(schemaClass, actionModules) {
    console.log("𝗔 start")
    graphNodes(schemaClass)
    actions.set(actionModules, graph.flow)
    graphEdges()
  }

  install(_Vue, options) {
    console.log("𝗔 install vue plugin")
    _Vue.prototype.$f = graph.flow
    _Vue.prototype.$a = actions.newDispatcher("ui")
    _Vue.mixin(installMixin)
    this.a = actions.newDispatcher("𝗔")
    this.f = graph.flow
    this.kit({
      f: this.flow,
      a: this.action
    })
    actions.runEntity(_Vue)
  }
  [key: string]: any;
}