import {AVue} from "../src";
import {N} from "../src/index";
import {A} from "alak";

const Vue = require("vue")
Vue.config.silent = true

const store ={
  user:{
    nodes:{
      // id: F.get("get"),
      id: N.wrap("add").v(5),
      url: N,
      // m1: F.observ.v(2),      profile: F.mix(['id','m1'], 'getProfile'),
      // stats: F.in(["url","id"],"getStats"),
      stats2: N.in("id","getStats").out("stats3", "asIs"),
      stats3: N
    },
    actions:{
      asIs(asV, to){
        // console.log({to})
      },
      add(v,o){
        // console.log("add", v,o)/
        return v+v
      },
      getStats(id, stats){
        // console.log("in getStats→→→→", {id}, {stats})
        return "fine"+id
      },
      newId(){
        // console.log("v;", this.$f.user.id.v)
        this.$f.user.id(1)
        // console.log("v;", this.$f.user.id.v)
        this.$f.user.id.once(x=>{
          // console.log({x})
        })
        // this.$f.user.id(20)
        // console.log("v;", this.$f.user.id.v)
      },
      getProfile(...a){
        console.log(a)
        // this.$f.user.stats("x")
        return "x"
      },
      get(){
        return 1
      }
    }
  },
  gallery: {
    flows:{
      // list: F.on("user.profile", "get"),
      page: N,
    },
    actions:{
      get(){
        this.$f.gallery.page("x")
        let id = avue.ff("user.id")
        return [1]
      }
    }
  }
}



const avue = new AVue(store)
Vue.use(avue)


avue.kit.on(({a,f})=>{
  setTimeout(()=>{
    a.user.newId()
  }, 1000)
  f.user.url("x")
  // setTimeout(()=>{
  //
  // }, 1200)
})

let wm = new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  computed: {},
  methods: {}
})
