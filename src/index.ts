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
import { createEdges } from './create-edges'

// InstallAlak()

export const sync = {}
export const N = NodeFlowDsl
export const webpackActionsGetter = webPackActions

export interface AotfInstance {
  f: any
  ff: (flowName: string, value: any, contextName: string) => void
  a: any
  aa: (actionName: string, ...values: any) => void
}

function newGate(sym): AotfInstance {
  return {
    f: contextFlow(sym),
    ff: contextFlowPath(sym) as any,
    a: contextAction(sym, ''),
    aa: contextActionPath(sym)
  }
}
let ready = alak.A.flow
export class Aotf<T> implements PluginObject<T> {
  f: T
  a: Function

  constructor(private storeModules, private options: any = {}) {
    this.storeModules = wpContext(storeModules)
    if (options.log) {
      Aloger.silent(options.log)
    }
  }

  static sync = alak.A.flow
  static connect(contextName, onConnectListener: (aof: AotfInstance) => void): void {
    ready.on(() => onConnectListener(newGate(contextName)))
  }

  install(_Vue: any, options: any) {
    GlobalState.init(_Vue)
    actions.set(this.storeModules)
    createNodes(this.storeModules)
    createEdges(this.storeModules)
    graphEdges()

    let gate = newGate('Ω')

    _Vue.prototype.$g = GlobalState.data
    _Vue.mixin(installMixin)

    Aloger.simple(' ℵ → ƒ')
    Object.assign(this, gate)
    if (process.browser){
      window["aof"] = this
      ready(true)
    }
  }
}
