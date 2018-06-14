import {AVue} from "../src";

const Vue = require("vue")
Vue.config.silent = true
import {A} from "alak";

export default class FlowGraphSchema {
  rootNode = A.f("some_value")
  mmm = {
    ten: A.f,
    quad: A.on("ten", "quad")
  }
}

const actions = (a, f: FlowGraphSchema) => ({
  entry() {
    console.log("entry?")
  },
  mmm: {
    getTen() {
      return 10
    }
  }
})

const avue = new AVue(FlowGraphSchema, actions, true)
Vue.use(avue)
//
let wm = new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  computed: {},
  methods: {}
})







