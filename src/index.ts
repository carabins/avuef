// import {InstallAlak} from "./install-alak";
import {PluginObject} from "vue";
import * as alak from "alak";
import {graphNodes} from "./graph-nodes";
import {graphEdges} from "./graph-edges";
import {actions} from "./actions";
import {graph} from "./graph";
import {installMixin} from "./install-mixin";
import {webPackActions, wpContext} from "./wp-context";
import {Aloger} from "./logger";
import {flowConstructor} from "./flow-constructor";
import {GlobalState} from "./global-state";
import {contextAction, contextActionPath, contextFlow, contextFlowPath} from "./utils/deepProxy";


// InstallAlak()

export const sync = {}
export const F = flowConstructor
export const wpFlolderActions = webPackActions



export class AVue<T> implements PluginObject<T> {
  kit = alak.A.flow
  f: T
  a: Function
  constructor(private storeModules, private options: any = {}) {
    this.storeModules = wpContext(storeModules)

    if (options.silent) {
      Aloger.silent()
    }
  }

  install(_Vue:any, options:any) {
    GlobalState.init(_Vue)
    actions.set(this.storeModules)
    graphNodes(this.storeModules)

    if (!this.options.prioritySchema) {
      actions.runEntity.on(v => graphEdges())
    } else {
      graphEdges()
    }
    this.f = contextFlow("Ω")
    this.ff = contextFlowPath("Ω")
    _Vue.prototype.$g = GlobalState.data
    _Vue.mixin(installMixin)
    let a = contextAction("Ω","")
    this.a = a
    this.aa = contextActionPath("Ω")
    actions.runEntity(options)
    Aloger.simple(" 𝗔  ✶")

    this.kit({f: this.f, a})
  }

  [key: string]: any;

}
