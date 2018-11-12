import {AVue} from "../src";
import {F} from "../src/index";

const Vue = require("vue")
Vue.config.silent = true


export default class FlowGraphSchema {
  user = {
    id: F.get("user.get"),
    name: F.stored.global
  }
  gallery = {
    list: F.on("user.id", "api.getGallery")
  }
}

const actions = {
  user: {
    get(){
      // this.f.user.name("hello")
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
