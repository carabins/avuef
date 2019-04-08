import {graph} from './graph'
import {GlobalState} from './global-state'
import {LoStorage} from './utils/LoStorage'
import {Aloger} from './logger'
import {createFlowNode} from './create-flow'

const logFlow = (v, flow, size) => {
  if (v != null && Aloger.opt) {
    if (!flow.o.lc) return
    Aloger.group(` ƒ  ${flow.id} ←  ${flow.o.lc}`, [v, 'hooks : ' + size])
  }
}

const flowMutations = {}

let flowMap = {}
const bindFlow = (node, mutations = {}, pathName = '', path = []) => {
  Object.keys(node).forEach(name => {
    let maybeFlow = node[name]
    if (!maybeFlow) {
      throw `Wrong flow node : ${name}`
    }

    const initFlow = (flow, name) => {
      let uiListiners = (mutations[name] = new Set())


      let store = flow.isMeta('stored')
      let flowMutation = (flowMutations[flow.id] = v => {
        logFlow(v, flow, uiListiners.size)
        if (flow.isMeta('global') || flow.isMeta('state')) {
          GlobalState.setState(name, v)
        }
        if (uiListiners.size) {
          uiListiners.forEach(f => f(v), true)
        }
        // console.log(flow.id, v)
        if (store) {
          LoStorage.setItem(flow.id, v)
        }
      })
      flow.on(flowMutation)
      flowMap[flow.id] = flow
    }

    if (maybeFlow.isFlow) {
      initFlow(maybeFlow, name)
    } else {
      let m = (mutations[name] = {})
      path.push(name)
      bindFlow(maybeFlow, m, name + '.', path)
    }
  })
  path.shift()
  return {
    mutations,
    flowMap
  }
}

export function createNodes(storeModules) {
  let nodes = {}
  Object.keys(storeModules).forEach(k => {
    let f = storeModules[k].nodes
    if (f) {
      // f.parent = k
      nodes[k] = f
    }
  })

  // console.log(Object.keys(nodes))

  let flow = createFlowNode(nodes)


  let binded = bindFlow(flow)
  const mutateViewOnly = (ctx, path, value) => {
    let m = flowMutations[path]
    let f = binded.flowMap[path]
    if (f) {
      f.o.lc = 'silent ← ' + ctx
      f.silent(value)
      if (m) {
        m(value)
      }
    } else {
      console.error('flow not found for silent mutation', path)
    }
  }
  graph.flow = Object.assign(mutateViewOnly, flow)
  graph.mutations = binded.mutations
  graph.flowMap = binded.flowMap
}
