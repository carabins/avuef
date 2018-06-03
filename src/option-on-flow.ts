import {graph} from "./graph";
import {pathTo} from "./utils";

export function optionOnFlow(cleaner, comp, params) {
  let offList = []
  Object.keys(params).forEach(k => {
    let f = params[k]
    let flow = pathTo(k, graph.flow)
    if (flow) {
      if (flow.isMeta("lazy")) {
        if (graph.lazyActions.has(flow))
          graph.lazyActions.get(flow)('𝝭 ' + this.$options._componentTag)
      }
      let fn = v => f.call(comp, v)
      flow.on(fn)
      offList.push(() => flow.off(fn))
    } else {
      console.warn(`${this.$options._componentTag}.onFlow ƒ '${k}' flow not found`)
    }
  })
  cleaner.set(this, () =>
    offList.forEach(f => f())
  )
}