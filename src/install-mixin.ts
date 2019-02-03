import {optionMapflow} from "./option-mapflow";
import {optionOnFlow} from "./option-on-flow";
import {graph} from "./graph";
import {actions} from "./actions";
import {GlobalState} from "./global-state";
import {Aloger} from "./logger";
import {camelCase} from "fuse-box/Utils";
import {contextAction, contextFlow} from "./utils/deepProxy";

const mapCleaner = new Map()
const onCleaner = new Map()
const toData = new WeakMap()
const clearCleaner = (v, t) => {
  if (v.has(t)) {
    v.get(t)()
    v.delete(t)
  }
}
export const installMixin = {
  data() {
    if (toData.has(this))
      return toData.get(this)
    return {}
  },

  beforeCreate() {
    if (!this.$vnode) return
    let tag = this.$options._componentTag || this.$vnode.tag
    this.$f = contextFlow(`𝒱 ${tag}`)
    this.$a = contextAction("𝒱", tag)

    let mapFlowOptions = this.$options.mapFlow
    if (mapFlowOptions) {
      optionMapflow(mapCleaner, this, toData, mapFlowOptions)
    }
  },
  created() {
    let onFlowOptions = this.$options.onFlow
    if (onFlowOptions) {
      optionOnFlow(onCleaner, this, onFlowOptions)
    }
  },
  beforeDestroy() {
    clearCleaner(mapCleaner, this)
    clearCleaner(onCleaner, this)
  }
}
