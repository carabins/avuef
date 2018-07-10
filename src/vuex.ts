import {graph} from "./graph";
import {actions} from "./actions";


let store
export const vuex = {
  store: v => store = v,
  schema: (v) => schema(v)
}

const schema = (userStore) => {
  let flowList = {}
  let flowState = {}
  const flowToList = o => {
    Object.keys(o).forEach((k: any) => {
      let f = o[k]
      if (f.isFlow && f.isMeta("vuex")) {
        flowList[f.id] = f
        flowState[f.id] = f.v
        f.on(v=>{
          flowState[f.id] = f.v
        })
      } else {
        flowToList(f)
      }
    })
  }
  flowToList(graph.flow)

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
    actions: userStore.actions? userStore.actions : {}
  }


}