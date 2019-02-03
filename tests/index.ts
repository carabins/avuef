import {AVue} from "../src";
import {F} from "../src/index";
import {A} from "alak";

const Vue = require("vue")
Vue.config.silent = true

const store ={
  user:{
    flows:{
      id: F.get("get"),
      name: F
    },
    actions:{
      get(){
        this.$f.user.name("v")
        return 1
      }
    }
  },
  gallery: {
    flows:{
      list: F.on("user.id", "get"),
      page: F,
    },
    actions:{
      get(){
        this.$f.gallery.page("x")
        return [1]
      }
    }
  }
}



const avue = new AVue(store)
Vue.use(avue)




let wm = new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  computed: {},
  methods: {}
})
