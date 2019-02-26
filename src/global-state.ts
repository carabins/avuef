export function observableValue(v){
  let observable = GlobalState.Vue.observable as any
  observable(v)
  if (Array.isArray(v))
    v.forEach(observable)
  else
    Object.keys(v).forEach(k=>observable(v[k]))
  return v
}
const data = {
  during: {},
  state: {}
}
export const GlobalState = {
  init(vue){
    this.Vue = vue
    observableValue(data)
  },
  Vue:{} as any,
  data,
  setRun: (key, value) => {
    // let o = wm.$data.during
    // wm.$set(wm, 'during', Object.assign({}, o, {[key]: value}))
  },
  setState: (key, value) => {
    data.state[key] = value
    // let o = wm.$data.state
    // wm.$set(wm, 'state', Object.assign({}, o, {[key]: value}))
  },
}
