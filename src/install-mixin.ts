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
function newAction(tagName){
  return function(name, ...args){
    Aloger.group(` 𝜶 ${name} ← 𝒱 ${tagName}`, args)


    // console.log({x})

    return actions.launch(name, ...args)
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
    // console.log(this)

    let tag = this.$options._componentTag || this.$vnode.tag

    // const doAction = tag => (name, ...args) => {
    //   let tag = this.$options._componentTag || this.$vnode.tag
    //
    // }
    this.$f = contextFlow(`𝒱 ${tag}`)

    let launch = newAction(tag) as any
  //   launch.bind({
  //     z:"z"
  // })

    this.$a = launch
    // this.$vnode.componentInstance.$x = "xxx"
    // this.$vnode.componentOptions.$x = "xxx"
    // this.$x = "xXx"
    // console.log(this)
    //
    // console.log(this.$vnode)


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
