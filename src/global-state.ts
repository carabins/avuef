import V1 from "vue"
const V2 = require("vue")
let Vue = V1 ? V1 : V2
// let wm // = V1 ? V1 : V2

const wm = new Vue({
  data: {
    during: {},
    state: {}
  }
})

export const GlobalState = {
  data: wm,
  setRun: (key, value) => {
    let o = wm.$data.during
    wm.$set(wm, 'during', Object.assign({}, o, {[key]: value}))
  },
  setState: (key, value) => {
    let o = wm.$data.state
    wm.$set(wm, 'state', Object.assign({}, o, {[key]: value}))
  },
}
