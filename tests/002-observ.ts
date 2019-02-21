const Vue = require("vue")
import {AVue, F} from "../src";
import { mount } from '@vue/test-utils'


const Item = {
  template: `
    <i>{{item.name}}</i>
  `,
  props:["item"]
}

const Items = {
  template: `
    <p>
      <Item v-for="item in items" :key="item.id" :item="item"></Item>
    </p>
  `,
  components:{Item},
  mapFlow:{
    items: "items.list"
  },
  methods: {
    increment() {
      this.count++
    }
  }
}




const store ={
  items:{
    flows:{
      list: F.v({})
    },
    actions:{
      get(){
        // this.$
        return 1
      }
    }
  },
}



const avue = new AVue(store, {silent:true})
Vue.use(avue)

Vue.config.silent = true


const wrapper = mount(Items)
// const vm = wrapper.vm

console.log(wrapper.contains('i'))

avue.kit.on(({f,a})=>{
  // console.log(f)

  // console.log("↑", f.user.data.v)
  // console.log(wrapper.html())
  let id = Math.random()
  f.items.list.mutate(o=>{
    o[id] = {id, name:1}
    return o
  })

  console.log(wrapper.contains('i'))
  console.log(wrapper.html())
  // f.items.list.mutate(o=>{
  //   o[id] = {id, name:2}
  //   return o
  // })
  f.items.list.v[id].name = 3
  console.log(wrapper.html())
})


