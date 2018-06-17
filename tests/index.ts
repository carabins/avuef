import {AVue} from "../src";

const Vue = require("vue")
Vue.config.silent = true
import {A} from "alak";

export default class FlowGraphSchema {
  rootNode = A.f("some_value")
  mod = {
    x: A.get("getX"),
    quad: A.on("x", "quad"),
    sub: {
      r: A.on("mod.quad", "deepFn")
    }
  }
}

const actions = (a, f) => ({
  entry() {
    console.log(f.rootNode.v)
    f.mod.sub.r.on(v => a("logResult", v))
  },
  logResult: v => console.log("result", v),
  mod: {
    quad: v => v * v,
    getX: () => 10,
    sub: {
      add: v => v + v,
      deepFn(v) {
        let r = a("mod.sub.add", v)
        f("mod.x", 11) // изменяет узел не вызывая изменения дочерних узлов
        return r
      }
    }
  }
})

const avue = new AVue(FlowGraphSchema, actions, false)
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

avue.vuex.schema()

