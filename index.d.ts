import {AFlow} from "alak";
import Vue from "vue";

//-- AVue
//*Base class for create Avue instance
//*```
//*import Vue from 'vue'
//*import {AVue} from "avuef";
//*const avue = new AVue<FlowGraph>(FlowGraphClass, actionModules)
//*vue.use(avue)
//*```
export declare class AVue<T> {
  a: AVueActions
  f: AVueFlow<T>
  /**
   * Schema сlass is a store and a data graph flow.
   * ```
   * class FlowGraphSchema {
   *   showSettingsPanel: A.f.emitter()
   *   module = {
   *      userDNK: A.f.stored,
   *      user: A.on("userDNK", "get-user-by-dnk"),
   *      world: A.lazyOn("user", "get-user-world")
   *      sub: {
   *        test: A.lazyOn("module.userDNK", "module0.deep-action")
   * }}}
   * ```
   * Actions modules can be initialized as returned object form function
   * with flow instance and action launcher arguments
   * ```
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

//-- AGraphNode
//* The types of nodes for the graph flow can be mixed as needed
//* ```
//* A.f.state.stored
//* A.f.stored.immutable
//* ```
type AGraphNode<T> = {
  /**
   * Create one way binding in global store.
   * ```
   * // in FlowGraph class
   *  module = {
   *    hello: A.f.state
   *    subModule: {
   *      world: A.f("predefinedValue").state
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
   * ```
   *  module = {
   *    user: A.f.state.stored
   *    userId: A.f.stored
   *  }
   * ```
   */
  stored: AGraphNode<T>
  /**
   * Any get data value for node will be cloned
   * ```
   * // in FlowGraph class
   *  module = {
   *    user: A.f({name:"Xaero"}).immutable
   *  }
   * // in action function
   * (a,f)=>({
   *  "send-user-to-space"(){
   *    let user = f.module.user.v
   *    user.
   *  }
   * })
   * ```
   */
  immutable: AGraphNode<T>
  stateless(): AGraphNode<T>
  emitter(): AGraphNode<T>
} | AFlow<T> | { (v): AFlow<typeof v> } | { (v): AGraphNode<typeof v> }
///-

//-- A
//*graph flow schema builder const based on alak library
export declare interface IA {
  /**
   * Create base flow node , same as `flow`.
   * ```
   * A.f
   * A.flow
   * ```
   */
  f: AGraphNode<any>
  flow: AGraphNode<any>
  /**
   * When update parent flow node call action with parent flow data and set returned data from action as current flow.
   * ```
   * A.on("user.id", "user.get-by-id")
   * ```
   */
  on: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   *  Create edge if current flow used in vue templates. When update parent flow node call action with parent flow data and set returned data from action as current flow.
   * ```
   * A.lazyOn("user.id", "user.get-by-id")
   * ```
   */
  lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * Create edge if current flow used in vue templates. Create flow from returned action data.
   * ```
   * A.get('users.get-list`)
   * ```
   */
  get: (actionPath: string) => AFlow<any>
  /**
   * Create edge if current flow used in vue templates. Create flow from returned action data.
   * ```
   * A.lazyGet('users.get-list`)
   * ```
   */
  lazyGet: (actionPath: string) => AFlow<any>
}

export declare const A: IA
///-

//-- $f
//* component prototype parameter for mutate graph flow store

type AVueFlow<T> = {
  /**
   * silent mutation without notify child edges/listeners in graph flow
   * just update state for ui components
   * ```
   * $f("someModule.firstFlow", {v:true,data:0})
   * ```
   */
  (flowPath: string, value: any): void
  /**
   * mutate and notify all edges/nodes/listeners in graph flow
   * ```
   * $f.someModule.firstFlow({v:true,data:0})
   * ```
   * or get value
   * ```
   * $f.someModule.firstFlow.v
   * ```
   */
  [metaParam: string]: AFlow<any>
} | T

///-

//-- $a
//* component prototype parameter for access global state and launch actions and more
export declare interface AVueActions {
  /**
   * Call action by path with argument
   * ```
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
   * ```
   * $a.during['get-by-id]
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
     * map flow data to component state property
     * ```
     * mapFlow:{
     *  "isOpen": "module1.openExitDialog"
     * }
     * ```
     * map grouped property form module with same name
     * ```
     * mapFlow:{
     *  "module1": ["openExitDialog","username], //map selected properties
     *  "module2": [] //map all properties
     * }
     * ```
     */
    mapFlow?: { [propNameOrModuleName: string]: string[] | string }
    /**
     * listen flow
     * ```
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