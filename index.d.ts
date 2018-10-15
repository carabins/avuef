import {AFlow} from "alak";
import Vue from "vue";


interface CoreFlow {

}


//-- F Base node types
//* The types of nodes for the graph flow can be mixed as needed
//* ```javascript
//* F.f.state.stored
//* F.f.stored.immutable
//* ```
type AGraphNode<T> = {
  /**
   * Create one way binding in global store.
   * ```javascript
   * // in FlowGraph class
   * class FlowStore {
   *    hello: F.f.state
   *    subModule: {
   *      world: F.f("predefinedValue").state
   *    }
   *  }
   * // in vue component
   * <template>
   *   <div>{{$a.state.hello}} + {{$a.state.world}} </div>
   * </template>
   * ```
   */
  state: AGraphNode<T>
  /**
   * Save and restore in local storage any data value.
   * ```javascript
   *  module = {
   *    user: F.f.state.stored
   *    userId: F.f.stored
   *  }
   * ```
   */
  stored: AGraphNode<T>
  /**
   * Any get data value for node will be cloned
   * ```javascript
   * // in FlowGraph class
   *  module0 = {
   *    user: F.f({name:"Xaero"}).immutable
   *    spy: F.on("user", "make-spy")
   *  }
   * // in action function
   * (a,f)=>({
   *   "make-spy" (user) {
   *     user.name // Xaero
   *     user.name = "Spy"
   *     f.module0.user.v.name // Xaero
   *     return user
   *   }
   * })
   * ```
   */
  immutable: AGraphNode<T>
  /**
   * Works as event bus. Can't mixed with other types.
   *```javascript
   * F.f.stateless()
   *```
   */
  stateless(): AFlow<T>
  /**
   * Adds the ability to call a node without a parameter
   * ```javascript
   * // in FlowGraph class
   *  class FlowStore {
   *    showSettingsPanel: F.f.stateless().emitter()
   *  }
   * // in vue component
   * <template>
   *   <button @click="$f.module.showSettingsPanel()">Show Settings</button>
   * </template>
   * // in other vue component
   * <script>
   *   export default {
   *    data:()=>({isOpen:false})
   *    onFlow: {
   *      "module.showSettingsPanel"() {
   *        this.isOpen = true
   *   }}}
   * </script>
   * ```
   */
  emitter(): AFlow<T>
} & AFlow<T> & { (v): AFlow<typeof v> } | { (v): AGraphNode<typeof v> }
///-

//-- F Graph Edges between nodes
//*F graph flow schema builder constant based on alak library
export declare interface IA {
  /**
   * Create base flow node , same as `flow`.
   * ```javascript
   * F.f
   * F.flow
   * ```
   */
  f: AGraphNode<any>
  flow: AGraphNode<any>
  /**
   * When update parent flow node call action with parent flow data and set returned data from action as current flow.
   * ```javascript
   * F.on("user.id", "user.get-by-id")
   * ```
   */
  on: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   *  Create edge if current flow used in vue templates. When update parent flow node call action with parent flow data and set returned data from action as current flow.
   * ```javascript
   * F.lazyOn("user.id", "user.get-by-id")
   * ```
   */
  lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * Create edge if current flow used in vue templates. Create flow from returned action data.
   * ```javascript
   * F.get('users.get-list')
   * ```
   */
  get: (actionPath: string) => AFlow<any>
  /**
   * Create edge if current flow used in vue templates. Create flow from returned action data.
   * ```javascript
   * F.lazyGet('users.get-list')
   * ```
   */
  lazyGet: (actionPath: string) => AFlow<any>
}

export declare const A: IA
///-


//-- AVue
//*Base class for create Avue instance
//*```javascript
//*import Vue from 'vue'
//*import {AVue} from "avuef"
//*
//*const avue = new AVue<FlowGraph>(FlowGraphClass, actionModules)
//*vue.use(avue)
//*```
export declare class AVue<T> {
  vuex: {
    store: (v) => void
    schema: () => any
  }
  a: AVueActions
  f: AVueFlow<T>

  /**
   * Schema сlass is a store and a data graph flow.
   * ```javascript
   * class FlowStore {
   *   showSettingsPanel: F.f.stateless()
   *   module = {
   *      userDNK: F.f.stored,
   *      user: F.on("userDNK", "get-user-by-dnk"),
   *      world: F.lazyOn("user", "get-user-world")
   *      sub: {
   *        test: F.lazyOn("module.userDNK", "module0.deep-action")
   * }}}
   * ```
   * Actions modules can be initialized as returned object form function
   * with flow instance and action launcher arguments
   * ```javascript
   * const actionModules (a, f) => ({
   *  entry() {
   *    // always run on start
   *  },
   *  module0:{
   *    dif: async (a,b) => a-b
   *  },
   *  module:{
   *    add: v => v+v,
   *    "new-user-by-dnk" (v) {
   *      let ten = a("add", 5) // in same module use relative path for call actions
   *      let two = await a("module0.dif", 5, 3)
   *      ...some create user by dnk code
   *      return user
   *    }
   * })
   * ```
   */
  constructor(schemaClass: T, actionModules: {
    (a, f: T): {
      [s: string]: Function
    } | any
  })
}

///-

export declare interface AVueConstructorOptions {
  prioritySchema: boolean,
  silent: boolean
}


//-- `$f` & `f` graph flow store mutator
//* Component prototype parameter for mutate graph flow store
export type AVueFlow<T> = {
  /**
   * Silent mutation without notify child edges/listeners in graph flow
   * just update state for ui components
   * ```javascript
   * $f("someModule.firstFlow", {v:true,data:0})
   * ```
   */
  (flowPath: string, value: any, options: AVueConstructorOptions): void
  /**
   * Mutate and notify all edges/nodes/listeners in graph flow
   * ```javascript
   * $f.someModule.firstFlow({v:true,data:0})
   * ```
   * get value in component methods
   * ```
   * let firstFlow = this.$f.someModule.firstFlow()
   * let sameAs = this.$f.someModule.firstFlow.v
   * ```
   * same get value in action modules
   * ```javascript
   * let sameAs = f.someModule.firstFlow.v
   * let immutableValue = f.someModule.firstFlow.imv
   * ```
   */
  [metaParam: string]: AFlow<any>
} & T
///-

//-- `$a` Actions component object
//* Component prototype parameter for launch actions, access global state, and more
export declare interface AVueActions {
  /**
   * Call action by path with argument
   * ```javascript
   * $a.launch("user.get-by-id", 1)
   * ```
   */
  launch(actionPath: string, ...args): Promise<any> | any

  /**
   * Global store for nodes with params `state` in graph flow schema.
   * Reactive update in ui templates.
   * ```$a.state.userId```
   */
  state: { [flowName: string]: any }
  /**
   * Progress boolean state for any action by same path
   * ```javascript
   * $a.during['get-by-id']
   * ```
   */
  during: { [actionPath: string]: boolean }
}

///-


declare module 'vue/types/vue' {
  interface Vue {
    $a: AVueActions
  }

  interface VueConstructor {
    $a: AVueActions
  }
}


//-- Vue Component Options
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    /**
     * map flow data to component state
     * ```javascript
     * // in FlowGraph class
     * class FlowStore {
     *    module0 = {
     *      greetings: F.f
     *    },
     *    module1 = {
     *      world: F.f,
     *      flowFromModule1: F.f
     *    },
     *    module2 = {
     *      flowFromModule2: F.f
     *      otherModule2Flow: F.f
     *    }
     *  }
     * // in vue component
     * <template>
     *   <pre>
     *     {{hello}} {{world}}
     *     {{flowFromModule1}}
     *     {{flowFromModule2}}
     *     {{otherModule2Flow}}
     *   </pre>
     * </template>
     * <script>
     *   export default {
     *    mapFlow:{
     *      "hello": "module0.greetings"
     *      "module1": ["world","flowFromModule1"], //map selected properties
     *      "module2": [] //map all properties
     * }}
     * </script>
     * ```
     */
    mapFlow?: { [propNameOrModuleName: string]: string[] | string }
    /**
     * listen flow
     * ```javascript
     * onFlow:{
     *  "module1.username"(v){
     *     this.username = v.toUpperCase()
     *     // ... just do something with v flow data value
     *  }
     * }
     * ```
     */
    onFlow?: { [flowPath: string]: (...dataValues) => void }
  }
}
///-