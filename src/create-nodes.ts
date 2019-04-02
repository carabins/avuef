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

      let pj = path.join('.')
      let id = pj ? pj + '.' + name : name
      flow.setId(id)
      let cmd = flow.isMeta('immutable') ? 'im' : 'on'

      let metaObj = {
        m: path.join('.'),
        name,
        cmd,
        path: path.slice()
      }
      if (flow.o) Object.assign(metaObj, flow.o)
      flow.setMetaObj(metaObj)

      let store = flow.isMeta('stored')

      let flowMutation = (flowMutations[id] = v => {
        logFlow(v, flow, uiListiners.size)
        if (flow.isMeta('global') || flow.isMeta('state')) {
          GlobalState.setState(name, v)
        }
        if (uiListiners.size) {
          uiListiners.forEach(f => f(v), true)
        }

        if (store) {
          LoStorage.setItem(flow.id, v)
        }
      })
      if (store) LoStorage.restoreFlow(flow.id, flow)
      flow[cmd](flowMutation)
      flowMap[id] = flow
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
    if (f) nodes[k] = f
  })

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