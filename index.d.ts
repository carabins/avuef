export declare interface AVueAction {
  launch(command: string, params?)
  state: any
  during: any
}
export declare interface IA {
  f:any
  on: (node: string, action: string)=>any
  lazyOn: (node: string, action: string)=>any
  lazyGet:any
  get:any
}
export declare const A:IA
export declare class AVue<T> {
  a: AVueAction
  f: T
  constructor(schemaClass: T, actionModules: {
    (a: AVueAction, f: T): {
      [s: string]: Function
    }
  })
}