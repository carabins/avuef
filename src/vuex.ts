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
      let key = f.id.replace(/\./g,"_")
      flowState[key] = f.v
      f.on(value =>
        store.commit("avue", {key, value})
      )
    }
  })


  let state = userStore.state ? Object.assign({}, userStore.state, flowState) : flowState
  let flowMutation = {
    "avue"(state, o) {
      state[o.key] = o.value
    }
  }
  let mutations = userStore.mutations ? Object.assign({}, userStore.mutations, flowMutation) : flowMutation

  return {
    state: () => state,
    mutations,
    actions: userStore.actions ? userStore.actions : {}
  }


}