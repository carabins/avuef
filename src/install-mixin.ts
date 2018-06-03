import {optionMapflow} from "./option-mapflow";
import {optionOnFlow} from "./option-on-flow";

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