import {AVue} from "../src";
import {F} from "../src/index";
import {A} from "alak";

const Vue = require("vue")
Vue.config.silent = true

const store ={
  user:{
    flows:{
      // id: F.get("get"),
      id: F.observ.v(1),
      profile: F.edge('id', 'getProfile'),
      stats: F.v
    },
    actions:{
      newId(){
        this.$f.user.id(10)
      },
      getProfile(){
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
      page: F,
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


avue.kit.on(({a})=>{
  setTimeout(()=>{
    a.user.newId()
  }, 1000)
})

let wm = new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  computed: {},
  methods: {}
})
