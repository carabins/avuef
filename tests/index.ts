import {AVue} from "../src"

const Vue = require("vue")
Vue.config.silent = true
import {A} from "alak";
import FlowStore from "./flowStore";
import {actionModules} from "./actions";

FlowStore

console.log({FlowStore})

export const avue = new AVue({
  FlowStore
})

class FF extends avue.edgeClass {
  ok() {
    this.rootNode.on(x=>{
      x.toUpperCase()
    })
  }
}


// Vue.use(avue)
//
// let wm = new Vue({
//   el: '#editor',
//   data: {
//     input: '# hello'
//   },
//   computed: {},
//   methods: {}
// })

// avue.vuex.schema({
//   actions: {
//     ok() {
//       console.log("ok action store")
//     }
// }
// })

// avue.vuex.store(new Proxy({},{}))