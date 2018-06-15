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
   * A.f
   * create base flow
   * same as flow
   */
  f: AVueFlow
  /**
   * A.flow
   * create base flow
   * same as f
   */
  flow: AVueFlow
  /**
   * A.on
   * create edge flow
   * when update parent flow node call action with parent flow data and set returned data from action as current flow
   * @param parentFlowPath : string as path to parent flow node
   * @param actionPath : string as path to called action
   */
  on: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * A.lazyOn
   * create edge if current flow used in vue templates
   * when update parent flow node call action with parent flow data and set returned data from action as current flow
   * @param parentFlowPath : string as path to parent flow node
   * @param actionPath : string as path to called action
   */
  lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * A.get
   * create flow from returned action data
   * @param {string} actionPath
   */
  get: (actionPath: string) => AFlow<any>
  /**
   * A.lazyGet
   * create flow from returned action data
   * if current flow used in vue templates
   * @param {string} actionPath
   */
  lazyGet: (actionPath: string) => AFlow<any>
}
export declare const A: IA
///-

//-- $a
//*vue template parameter for access global state and launch actions and more
export declare interface AVueActions {
  /**
   * Call action by path with argument,
   * @param {string} actionPath
   * @param args
   * @returns {Promise<any>}
   */
  launch(actionPath: string, ...args): Promise<any> | any

  /**
   * Global store for nodes with params `state` in flow graph schema
   */
  state: { [flowName: string]: any }
  /**
   * Progress bollean state for any action by same path
   */
  during: { [actionPath: string]: boolean }
}
///-

type AVueFlow = {
  (s?): AFlow<typeof s>
  [metaParam: string]: AFlow<any>
}


export type AFlowMutator<T> = T & FlowMutator
export type FlowMutator = {
  (s?): AFlow<typeof s>
}


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
     * @example
     * ```
     * mapFlow:{
     *  "isOpen": "module1.openExitDialog"
     * }
     * ```
     * map grouped property form module with same name
     * * @example
     * ```
     * mapFlow:{
     *  "module1": ["openExitDialog","username], //map selected properties
     *  "module2": [] //map all properties
     * }
     * ```
     */
    mapFlow?: {[propNameOrModuleName: string]: string[] | string}
    /**
     * listen flow
     * @example
     * ```
     * onFlow:{
     *  "module1.username"(v){
     *     this.username = v.toUpperCase()
     *     // ... just do something with v flow data value
     *  }
     * }
     * ```
     */
    onFlow?: {[flowPath: string]: (...dataValues) => void}
  }
}
///-