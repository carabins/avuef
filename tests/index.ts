import {AVue} from "../src";
import {F} from "../src/index";

const Vue = require("vue")
Vue.config.silent = true


export default class FlowGraphSchema {
  rootNode = F.stateless.stored(10)
  x1= F.bool(1)
  x4= F.bool(2)
  x2= F.lazyGet("action-for-get2")
  x3= F.sx.lazyGet("action-for-get3")
  xx = F.zx.sad.zz.zzz.zzz.zzz
  mod = {
    x: F.get("getX"),
    quad: F.on("x", "quad"),
    sub: {
      r: F.on("mod.quad", "deepFn")
    }
  }
}

const actions = (a, f) => ({
  entry() {
    console.log("f.x1", f.x1.v)
    console.log("f.x4", f.x4.v)
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

const avue = new AVue(FlowGraphSchema, actions)
Vue.use(avue)




let wm = new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  computed: {},
  methods: {}
})

// avue.vuex.schema({
//   actions: {
//     ok() {
//       console.log("ok action store")
//     }
//   }
// })

// avue.vuex.store(new Proxy({},{}))
