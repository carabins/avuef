import {AVue} from "../src";
const Vue = require("vue")
Vue.config.silent = true
import {A} from "alak";

export default class FlowGraphSchema {
  rootNode = A.f
  module1 = {
    node1: A.f,
    quadN1: A.on("node1", "quad"),
    addN2: A.on("quadN1", "submodule.add"),
    addN1: A.on("module1.quadN1", "action1"),

    nodeFromSameModuleAction: A.get("action1"),

    submodule: {
      subNode: A.on("module1.quadN1", "add"),
      subGetNode: A.get("add")
    },

  }
  module2 = {
    n2: A.f,
    nodeFromRootAction: A.get("action1"),
  }
}

const actions = (a, f: FlowGraphSchema) => ({
  entry() {
    f.module1.node1(3)
    f.module1.quadN1.on(v=>{
      console.log("quadN1", v)
    })
    f.module1.nodeFromSameModuleAction.on(v=>{
      console.log("nodeFromSameModuleAction",v)
    })
    f.module2.nodeFromRootAction.on(v=>{
      console.log("nodeFromRootAction",v)
    })

  },
  action1() {
    return "x"
  },
  module1: {
    action1(){
      return "m1"
    },
    "get-five"() {
      return 5
    },
    quad(v) {
      return v * v
    },
    submodule: {
      add: v => v + v
    }
  }
})

const avue = new AVue(FlowGraphSchema, actions)
Vue.use(avue)
//
// let wm = new Vue({
//   el: '#editor',
//   data: {
//     input: '# hello'
//   },
//   computed: {},
//   methods: {}
// })







