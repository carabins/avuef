import {graph} from './graph'
import {pathTo} from './utils'

export function optionOnFlow(cleaner, comp, params) {
  let offList = []
  let compName = comp._componentTag
  Object.keys(params).forEach(k => {
    let f = params[k]
    let flow = pathTo(k, graph.flow)

    if (flow) {
      if (flow.isMeta('lazy')) {
        if (graph.lazyActions.has(flow))
          graph.lazyActions.get(flow)('𝝭 ' + compName)
      }
      let fn = v => f.call(comp, v)
      flow.on(fn)
      offList.push(() => flow.off(fn))
    } else {
      console.warn(`${compName}.onFlow ƒ '${k}' flow not found`)
    }
  })
  cleaner.set(this, () => offList.forEach(f => f()))
}
