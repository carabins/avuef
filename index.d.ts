import {AFlow} from "alak";


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

type AVueFlow = {
  (s?): AFlow<typeof s>
  [metaParam: string]: AFlow<any>
}

export declare interface IA {
  /**
   * create base flow
   * same as flow
   */
  f: AVueFlow
  /**
   * create base flow
   * same as f
   */
  flow: AVueFlow
  /**
   * create edge flow
   * when update parent flow node call action with parent flow data and set returned data from action as current flow
   * @param parentFlowPath : string as path to parent flow node
   * @param actionPath : string as path to called action
   */
  on: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * create edge if current flow used in vue templates
   * when update parent flow node call action with parent flow data and set returned data from action as current flow
   * @param parentFlowPath : string as path to parent flow node
   * @param actionPath : string as path to called action
   */
  lazyOn: (parentFlowPath: string, actionPath: string) => AFlow<any>
  /**
   * create flow from returned action data
   * @param {string} actionPath
   */
  get: (actionPath: string) => AFlow<any>
  /**
   * create flow from returned action data
   * if current flow used in vue templates
   * @param {string} actionPath
   */
  lazyGet: (actionPath: string) => AFlow<any>
}

export declare const A: IA

export type AFlowMutator<T> = T & FlowMutator
export type FlowMutator = {
  (s?): AFlow<typeof s>
}

export declare class AVue<T> {
  a: AVueActions
  f: AFlowMutator<T>
  constructor(schemaClass: T, actionModules: {
    (a, f: T): {
      [s: string]: Function
    }
  })
}

declare global {
  interface Vue<T> {
    $a: AVueActions
  }
}
