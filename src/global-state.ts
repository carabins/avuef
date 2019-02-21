export function observableValue(v){
  let observable = GlobalState.Vue.observable as any
  observable(v)
  if (Array.isArray(v))
    v.forEach(observable)
  else
    Object.keys(v).forEach(k=>observable(v[k]))
  return v
}

export const GlobalState = {
  init(vue){
    this.Vue = vue
    observableValue(GlobalState.Vue)
  },
  Vue:{} as any,
  data: {
    during: {},
    state: {}
  },
  setRun: (key, value) => {
    // let o = wm.$data.during
    // wm.$set(wm, 'during', Object.assign({}, o, {[key]: value}))
  },
  setState: (key, value) => {
    // let o = wm.$data.state
    // wm.$set(wm, 'state', Object.assign({}, o, {[key]: value}))
  },
}
