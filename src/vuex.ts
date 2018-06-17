import {graph} from "./graph";
import {actions} from "./actions";


let store
export const vuex = {
  store: v => store = v,
  schema: () => schema()
}

const schema = () => {
  let flowList = {}
  const flowToList = o => {
    Object.keys(o).forEach((k: any) => {
      let f = o[k]
      if (f.isFlow) {
        flowList[f.id] = f
      } else {
        flowToList(f)
      }
    })
  }
  flowToList(graph.flow)

  let actionList = {}
  const actionsToList = (o, path = "") => {
    Object.keys(o).forEach(k => {
      let a = o[k]
      if (typeof a === "function") {
        actionList[path + k] = a
      } else {
        actionsToList(a, path ? path + "." + k : k)
      }
    })
  }
  actionsToList(actions.modules)


  let vuexSchema = {
    state: () => {
    },
    mutations: {
      "avue"(state, o) {
        state[o.key] = o.value
      }
    },
    actions: {}
  }
  Object.keys(flowList).forEach(key => {
    let f = flowList[key]
    f.on(value => store ? store.commit("avue", {key, value}) : false)
    vuexSchema.mutations[key] = (store, value) => f(value)
  })
  Object.keys(actionList).forEach(key => {
    // let a = actionList[key]
    let launch = actions.newDispatcher("vuex")
    vuexSchema.actions[key] = (ctx, ...value) => launch(key, ...value)
  })
  return vuexSchema


}