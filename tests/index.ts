import {AVue} from "../src";
import {F} from "../src/index";

const Vue = require("vue")
Vue.config.silent = true


export default class FlowGraphSchema {
  user = {
    id: F.get("user.get"),
    name: F,
    name3: F.v("noname"),
    name1: F.stored.global.v("noname")
  }
  gallery = {
    list: F.on("user.id", "api.getGallery")
  }
}

const actions = {
  user: {
    get(){
      console.log(this.f.user.name.v)
      this.f.user.name("hello")
      console.log(this.f.user.name.v)
      return 'user'+Math.round(Math.random()*1000)
    }
  },
  api:{
    getGallery(userid){
      console.log("api.getGallery", {userid})
      return [1,2,3]
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
