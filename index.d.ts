import {AFlow} from "alak";
import Vue from "vue";

//-- AVue
//*Base class for create avuef instance
//*```
//*AVue<T>{
//*  a: AVueActions
//*  f: AFlowMutator<T>
//*  constructor(schemaClass: T, actionModules: {
//*    (a, f: T): {
//*      [s: string]: Function
//*    } | any
//*  })
//*}
//*```
///
export declare class AVue<T> {
  a: AVueActions
  f: AFlowMutator<T>

  constructor(schemaClass: T, actionModules: {
    (a, f: T): {
      [s: string]: Function
    } | any
  })
}

//-- A
//*flow graph schema builder const based on alak library
export declare interface IA {
  /**
   * Create base flow, same as `flow`.
   * ```A.f```
   */
  f: AVueFlow
  /**
   * Create base flow same as `f`.
   * ```A.flow```
   */
  flow: AVueFlow
  /**
   * When update parent flow node call action with parent flow data and set returned data from action as current flow.
   * ```A.on("user.id", "user.get-by-id")```
   */
  on: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   *  Create edge if current flow used in vue templates. When update parent flow node call action with parent flow data and set returned data from action as current flow.
   * ```A.lazyOn("user.id", "user.get-by-id")```
   */
  lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * Create edge if current flow used in vue templates. Create flow from returned action data.
   * ```A.get('users.get-list`)```
   */
  get: (actionPath: string) => AFlow<any>
  /**
   * Create edge if current flow used in vue templates. Create flow from returned action data.
   * ```A.lazyGet('users.get-list`)```
   */
  lazyGet: (actionPath: string) => AFlow<any>
}

export declare const A: IA
///-

//-- $f
//* component prototype parameter for mutate flow graph store

type AVueFlow = {
  /**
   * silent mutation without notify child edges/listeners in flow graph
   * just update state for ui components
   * ```$f("someModule.firstFlow", {v:true,data:0})```
   */
  (flowPath: string, value: any): void
  /**
   * mutate and notify all edges/nodes/listeners in flow graph
   * ```$f.someModule.firstFlow({v:true,data:0})```
   * or get value
   * ```$f.someModule.firstFlow.v```
   */
  [metaParam: string]: AFlow<any>
}

///-

//-- $a
//* component prototype parameter for access global state and launch actions and more
export declare interface AVueActions {
  /**
   * Call action by path with argument
   * ```$a.launch("user.get-by-id", 1)```
   */
  launch(actionPath: string, ...args): Promise<any> | any

  /**
   * Global store for nodes with params `state` in flow graph schema.
   * Reactive update in ui templates.
   * ```$a.state.userId```
   */
  state: { [flowName: string]: any }
  /**
   * Progress boolean state for any action by same path
   * ```$a.during['get-by-id]```
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