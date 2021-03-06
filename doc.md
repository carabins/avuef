#  A Base node types
 The types of nodes for the graph flow can be mixed as needed
 ```javascript
 A.f.state.stored
 A.f.stored.immutable
 ```
##   state: AGraphNode<T> 
 Create one way binding in global store.
 ```javascript
 // in FlowGraph class
 class FlowGraphSchema {
    hello: A.f.state
    subModule: {
      world: A.f("predefinedValue").state
    }
  }
 // in vue component
 <template>
   <div>{{$a.state.hello}} + {{$a.state.world}} </div>
 </template>
 ```
##   stored: AGraphNode<T> 
 Save and restore in local storage any data value.
 ```javascript
  module = {
    user: A.f.state.stored
    userId: A.f.stored
  }
 ```
##   immutable: AGraphNode<T> 
 Any get data value for node will be cloned
 ```javascript
 // in FlowGraph class
  module = {
    user: A.f({name:"Xaero"}).immutable
  }
 // in action function
 (a,f)=>({
  "send-user-to-space"(){
             let user = f.module.user.v
             user.teleport = await a("open-teleport", user)
             f.module.user.v.teleport // is undefined
           }
 })
 ```
##   stateless(): AFlow<T> 
 Works as event bus. Can't mixed with other types.
```javascript
 A.f.stateless()
```
##   emitter(): AFlow<T> 
 Adds the ability to call a node without a parameter
 ```javascript
 // in FlowGraph class
  class FlowGraphSchema {
    showSettingsPanel: A.f.stateless().emitter()
  }
 // in vue component
 <template>
   <button @click="$f.module.showSettingsPanel()">Show Settings</button>
 </template>
 // in other vue component
 <script>
   export default {
    data:()=>({isOpen:false})
    onFlow: {
      "module.showSettingsPanel"() {
        this.isOpen = true
   }}}
 </script>
 ```
#  A Graph Edges between nodes
A graph flow schema builder constant based on alak library
##   f: AGraphNode<any> 
 Create base flow node , same as `flow`.
 ```javascript
 A.f
 A.flow
 ```
##   on: (parentFlowPath: string, actionPath: string) => AFlow<any> 
 When update parent flow node call action with parent flow data and set returned data from action as current flow.
 ```javascript
 A.on("user.id", "user.get-by-id")
 ```
##   lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any> 
  Create edge if current flow used in vue templates. When update parent flow node call action with parent flow data and set returned data from action as current flow.
 ```javascript
 A.lazyOn("user.id", "user.get-by-id")
 ```
##   get: (actionPath: string) => AFlow<any> 
 Create edge if current flow used in vue templates. Create flow from returned action data.
 ```javascript
 A.get('users.get-list')
 ```
##   lazyGet: (actionPath: string) => AFlow<any> 
 Create edge if current flow used in vue templates. Create flow from returned action data.
 ```javascript
 A.lazyGet('users.get-list')
 ```
#  AVue
Base class for create Avue instance
```javascript
import Vue from 'vue'
import {AVue} from "avuef"

const avue = new AVue<FlowGraph>(FlowGraphClass, actionModules)
vue.use(avue)
```
##   constructor(schemaClass: T, actionModules: { 
 Schema сlass is a store and a data graph flow.
 ```javascript
 class FlowGraphSchema {
   showSettingsPanel: A.f.stateless()
   module = {
      userDNK: A.f.stored,
      user: A.on("userDNK", "get-user-by-dnk"),
      world: A.lazyOn("user", "get-user-world")
      sub: {
        test: A.lazyOn("module.userDNK", "module0.deep-action")
 }}}
 ```
 Actions modules can be initialized as returned object form function
 with flow instance and action launcher arguments
 ```javascript
 const actionModules (a, f) => ({
  entry() {
    // always run on start
  },
  module0:{
    dif: async (a,b) => a-b
  },
  module:{
    add: v => v+v,
    "new-user-by-dnk" (v) {
      let ten = a("add", 5) // in same module use relative path for call actions
      let two = await a("module0.dif", 5, 3)
      ...some create user by dnk code
      return user
    }
 })
 ```
#  `$f` & `f` graph flow store mutator
 Component prototype parameter for mutate graph flow store
##   (flowPath: string, value: any): void 
 Silent mutation without notify child edges/listeners in graph flow
 just update state for ui components
 ```javascript
 $f("someModule.firstFlow", {v:true,data:0})
 ```
##   [metaParam: string]: AFlow<any> 
 Mutate and notify all edges/nodes/listeners in graph flow
 ```javascript
 $f.someModule.firstFlow({v:true,data:0})
 ```
 get value in component methods
 ```
 let firstFlow = this.$f.someModule.firstFlow()
 let sameAs = this.$f.someModule.firstFlow.v
 ```
 same get value in action modules
 ```javascript
 let sameAs = f.someModule.firstFlow.v
 let immutableValue = f.someModule.firstFlow.imv
 ```
#  `$a` Actions component object
 Component prototype parameter for launch actions, access global state, and more
##   launch(actionPath: string, ...args): Promise<any> | any 
 Call action by path with argument
 ```javascript
 $a.launch("user.get-by-id", 1)
 ```
##   state: { [flowName: string]: any } 
 Global store for nodes with params `state` in graph flow schema.
 Reactive update in ui templates.
 ```$a.state.userId```
##   during: { [actionPath: string]: boolean } 
 Progress boolean state for any action by same path
 ```javascript
 $a.during['get-by-id']
 ```
#  Vue Component Options

##     mapFlow?: { [propNameOrModuleName: string]: string[] | string } 
 map flow data to component state
 ```javascript
 // in FlowGraph class
 class FlowGraphSchema {
    module0 = {
      greetings: A.f
    },
    module1 = {
      world: A.f,
      flowFromModule1: A.f
    },
    module2 = {
      flowFromModule2: A.f
      otherModule2Flow: A.f
    }
  }
 // in vue component
 <template>
   <pre>
     {{hello}} {{world}}
     {{flowFromModule1}}
     {{flowFromModule2}}
     {{otherModule2Flow}}
   </pre>
 </template>
 <script>
   export default {
    mapFlow:{
      "hello": "module0.greetings"
      "module1": ["world","flowFromModule1"], //map selected properties
      "module2": [] //map all properties
 }}
 </script>
 ```
##     onFlow?: { [flowPath: string]: (...dataValues) => void } 
 listen flow
 ```javascript
 onFlow:{
  "module1.username"(v){
     this.username = v.toUpperCase()
     // ... just do something with v flow data value
  }
 }
 ```
