
import {graph} from "./graph";
import {GlobalState} from "./global-state";
import {LoStorage} from "./utils/LoStorage";

const logFlow = (v, flow) => {
  if (typeof v === 'object' && v != null) {
    console.groupCollapsed(` ƒ  ${flow.o.m}`)
    console.log(`${flow.isMeta('immutable') ? "immutable" : "mutable"} :`, v)
    console.log(`META : ${flow.meta()}`)
    console.groupEnd()
  } else {
    console.log(` ƒ  ${flow.o.m}`, v)
  }
}

const bindFlow = (node,
                  mutations = {},
                  pathName = "",
                  path = []
) => {
  Object.keys(node).forEach(name => {
    let maybeFlow = node[name]
    const initFlow = (flow, name) => {
      let mutation = mutations[name] = new Set()
      // let path = aPath.join("_")
      let id = path.join(".") +"."+name
      flow.setId(id)
      let cmd = flow.isMeta("immutable") ? "im" : "on"
      flow.setMetaObj({
        m: path.join("."), name, cmd, path : path.slice()
      })

      let isState = flow.isMeta("state")
      let store = flow.isMeta("stored")
      if (store)
        LoStorage.restoreFlow(id, flow)
      flow[cmd](v => {
        if (isState) {
          GlobalState.setState(name, v)
        }
        if (mutation.size) {
          logFlow(v, flow)
          mutation.forEach(f => f(v), true)
        }
        if (store) {
          LoStorage.setItem(id, v)
        }
      })
    }
    if (maybeFlow.isFlow) {
      initFlow(maybeFlow, name)
    } else {
      let m = mutations[name] = {}
      path.push(name)
      bindFlow(maybeFlow,  m, name + ".", path)
    }
  })
  path.shift()
  return {
    mutations: mutations
  }
}


export function graphNodes(schemaClass) {
  const flow = new schemaClass()
  let binded = bindFlow(flow)
  graph.flow = flow
  graph.mutations = binded.mutations

}