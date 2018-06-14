import {graph} from "./graph";
import {GlobalState} from "./global-state";
import {LoStorage} from "./utils/LoStorage";
import {throws} from "assert";
import {pathTo} from "./utils";

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

const flowMutations = {}

const bindFlow = (node,
                  mutations = {},
                  pathName = "",
                  path = []
) => {
  Object.keys(node).forEach(name => {
    let maybeFlow = node[name]
    if (!maybeFlow) {
      throw `Wrong flow node : ${name}`
    }

    const initFlow = (flow, name) => {
      let uiListiners = mutations[name] = new Set()

      let id = path.join(".") + "." + name
      flow.setId(id)
      let cmd = flow.isMeta("immutable") ? "im" : "on"
      flow.setMetaObj({
        m: path.join("."), name, cmd, path: path.slice()
      })

      let store = flow.isMeta("stored")
      if (store)
        LoStorage.restoreFlow(flow.id, flow)

      let uiMutation = flowMutations[id] = v => {
        if (flow.isMeta("state")) {
          GlobalState.setState(name, v)
        }
        if (uiListiners.size) {
          logFlow(v, flow)
          uiListiners.forEach(f => f(v), true)
        }
        if (store) {
          LoStorage.setItem(flow.id, v)
        }
      }

      flow[cmd](uiMutation)
    }

    if (maybeFlow.isFlow) {
      initFlow(maybeFlow, name)
    } else {
      let m = mutations[name] = {}
      path.push(name)
      bindFlow(maybeFlow, m, name + ".", path)
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
  const mutateViewOnly = (path, value) => {
    let m = flowMutations[path]
    let f = pathTo(path, flow)
    if (f) {
      f.silent(value)
      if (m) {
        m(value)
      }
    } else {
      console.error("flow not found", path)
    }
  }
  graph.flow = Object.assign(mutateViewOnly, flow)
  graph.mutations = binded.mutations

}