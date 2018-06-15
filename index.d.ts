import {AFlow} from "alak/dist/def/AFlow";

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
  f: AVueFlow
  flow: AVueFlow
  on: (node: string, action: string) => AFlow<any>
  lazyOn: (node: string, action: string) => AFlow<any>
  get: (action: string) => AFlow<any>
  lazyGet: (action: string) => AFlow<any>
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
