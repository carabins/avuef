import {graph} from "./graph";
import {actions} from "./actions";


let store
export const vuex = {
  get state() {
    return store.state
  },
  store(v) {
    if (v) store = v
    return store
  },
  schema: (v) => schema(v)
}

const schema = (userStore: any = {}) => {
  let flowState = {}

  Object.keys(graph.flowMap).forEach((k: any) => {
    let f = graph.flowMap[k]
    if (f.isFlow && f.isMeta("vuex")) {
      flowState[f.id] = f.v
      f.on(value => {
        store.commit("avue", {key: f.id, value})
      })
    }
  })


  // let actionList = {}
  // const actionsToList = (o, path = "") => {
  //   Object.keys(o).forEach(k => {
  //     let a = o[k]
  //     if (typeof a === "function") {
  //       actionList[path + k] = a
  //     } else {
  //       actionsToList(a, path ? path + "." + k : k)
  //     }
  //   })
  // }
  // actionsToList(actions.modules)
  // userStore.state = userStore.state ? userStore.state :{}
  //
  let state = userStore.state ? Object.assign({}, userStore.state, flowState) : flowState
  let flowMutation = {
    "avue"(state, o) {
      state[o.key] = o.value
    }
  }
  let mutations = userStore.mutations ? Object.assign({}, userStore.mutations, flowMutation) : flowMutation
  // let vuexSchema =
  // Object.keys(flowList).forEach(key => {
  //   let f = flowList[key]
  //   f.on(value => store ? store.commit("avue", {key, value}) : false)
  //   vuexSchema.mutations[key] = (store, value) => f(value)
  // })
  // Object.keys(actionList).forEach(key => {
  //   // let a = actionList[key]
  //   let launch = actions.newDispatcher("vuex")
  //   vuexSchema.actions[key] = (ctx, ...value) => launch(key, ...value)
  // })
  return {
    state: () => state,
    mutations,
    actions: userStore.actions ? userStore.actions : {}
  }


}