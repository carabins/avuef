import {AVue} from "../src";
import {F} from "../src/index";

const Vue = require("vue")
Vue.config.silent = true


export default class FlowGraphSchema {
  // rootNode = F.stateless.stored(10)
  x1= F.bool(0)
  // x4= F.bool(2)
  // x2= F.lazyGet("action-for-get2")
  // x3= F.sx.lazyGet("action-for-get3")
  // xx = F.zx.sad.zz.zzz.zzz.zzz
  mod = {
    x: F.get("getX"),
    // quad: F.on("x", "quad"),
    x1 : F.bool(1),
    x2 : F.bool,
    sub: {
      // r: F.on("mod.quad", "deepFn"),
      x: F.f
    }
  }
}

const actions = {
  getX(){
    console.log("↓↑≀→←↓→action getX log", this.f.x1.v)
    this.f.x1(false)
    this.f.mod.x2(false)
    this.f("mod.x1", true)
    this.a("entryx",0)
  },
  async entryx(c) {
    // console.log("→→→→", this.f.x1(1))
    let x = await this.a.mod.getX()
    let deepFn = this.a.mod.sub.deepFn()
    let a = this.a.mod.muta()
    console.log({deepFn})
    //
    // console.log("f.x1→→")
    // console.log("f.x4", f.x4.v)
    // f.mod.sub.r.on(v => a("logResult", v))
  },
  // logResult: v => console.log("result", v),
  mod: {
    muta(){
      console.log("muta", this)
    },
    quad: v => v * v,
    getX: () => 10,
    sub: {
      add: v => v + v,
      deepFn(v) {

        return true
        // let r = a("mod.sub.add", v)
        // f("mod.x", 11) // изменяет узел не вызывая изменения дочерних узлов
        // return r
      }
    }
  }
}

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
