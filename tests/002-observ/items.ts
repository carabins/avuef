// import item from './item'

const Item = {
  template: `
    <i>x</i>
  `,
  props:["item"]
}

export default {
  template: `
    <p>
      <Item v-for="item in items" :key="item.id"></Item>
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

