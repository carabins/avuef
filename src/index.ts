// import {InstallAlak} mix "./install-alak";
import { PluginObject } from 'vue'
import * as alak from 'alak'
import { createNodes } from './create-nodes'
import { graphEdges } from './graph-edges'
import { actions } from './actions'
import { installMixin } from './install-mixin'
import { webPackActions, wpContext } from './wp-context'
import { Aloger } from './logger'
import { NodeFlowDsl } from './NodeFlowDsl'
import { GlobalState } from './global-state'
import {
  contextAction,
  contextActionPath,
  contextFlow,
  contextFlowPath
} from './utils/deepProxy'
import {createEdges} from "./create-edges";

// InstallAlak()

export const sync = {}
export const N = NodeFlowDsl
export const webpackActionsGetter = webPackActions

export class AVue<T> implements PluginObject<T> {
  onStart = alak.A.flow
  f: T
  a: Function

  constructor(private storeModules, private options: any = {}) {
    this.storeModules = wpContext(storeModules)

    if (options.log) {
      Aloger.silent(options.log)
    }
  }

  install(_Vue: any, options: any) {
    GlobalState.init(_Vue)
    actions.set(this.storeModules)
    createNodes(this.storeModules)
    createEdges(this.storeModules)
    graphEdges()
    this.f = contextFlow('Ω')
    this.ff = contextFlowPath('Ω')
    let a = contextAction('Ω', '')
    this.a = a
    this.aa = contextActionPath('Ω')

    _Vue.prototype.$g = GlobalState.data
    _Vue.mixin(installMixin)

    Aloger.simple(' ℵ → ƒ')

    this.onStart({ f: this.f, a })
  }

  [key: string]: any
}
