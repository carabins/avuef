import {Aotf} from "../src";
import {N} from "../src/index";
import {A} from "alak";

const Vue = require("vue")
Vue.config.silent = true

const store ={
  user:{
    edges:[
      "entry",
      "justEdge id stats3"
    ],
    nodes:{
      // id: F.get("get"),
      id: N.immutable,
      url: N.stored.value(0),
      // m1: F.observ.v(2),      profile: F.mix(['id','m1'], 'getProfile'),
      // stats: F.in(["url","id"],"getStats"),
      // stats2: N.in("getStats id ").out("asIs stats3"),
      // stats3: N
    },
    actions:{
      entry(){
        // console.log("entry")
      },
      justEdge(id, s3){
        console.log(this.stats3)
      },
      asIs(asV, to){
        // console.log({to})
        return asV
      },
      add(v,o){
        // console.log("add", v,o)/
        return v+v
      },
      getStats(id, url, stats){
        // console.log("in getStats→→→→", {id}, {stats}, {url})
        return "fine"+id
      },
      newId({a,f}){
        // console.log("v;", this.$f.user.id.v)
        f.user.id(1)
        // console.log("v;", this.$f.user.id.v)
        f.user.id.once(x=>{
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

  n3: {
    nodes:{
      nn3: N,
    },
  },
  n2: {
    nodes:{
      nn2: N,
    },
  },
  gallery: {
    nodes:{
      // list: F.on("user.profile", "get"),
      page: N,
    },
    actions:{
      get({f, ff}){
        f.gallery.page("x")
        let id = ff("user.id")
        return [1]
      }
    }
  }
}



const avue = new Aotf(store)
Vue.use(avue)


Aotf.connect("start", ({a,f})=>{
  setTimeout(()=>{
    a.user.newId()
  }, 1000)
  // f.user.url("x")
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
