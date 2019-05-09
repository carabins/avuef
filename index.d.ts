import { AFlow } from "alak";
import Vue from "vue";
import {AotfInstance} from "./src";

type AGraphNode = {
  global: AGraphNode;
  stored: AGraphNode;
  observ: AGraphNode;
  immutable: AGraphNode;
  stateless: AGraphNode;
  emitter: AGraphNode;

  in(parentFlowPath: string, actionPath?: string) : AGraphNode;
  out(parentFlowPath: string, actionPath?: string) : AGraphNode;

  bind(actionPath: string) : AGraphNode;
  born(actionPath: string) : AGraphNode;
  wrap(actionPath: string) : AGraphNode;

  start(value: string) : AGraphNode;
  value(value: string) : AGraphNode;
};

export declare interface IA {
  v: AFlow<any>;
  <T>(v: T): AFlow<T>;
}

export declare const N: AGraphNode;

export declare class AVue<T> {
  vuex: {
    store: (v) => void;
    schema: () => any;
  };
  a: AVueActions;
  f: AVueFlow<T>;
  static connect: (contextName, onConnectListener: (aof: AotfInstance) => void) => void
  static sync: AFlow<any>

  constructor(
    schemaClass: T,
    actionModules: {
      (a, f: T):
        | {
        [s: string]: Function;
      }
        | any;
    }
  );
}

export declare interface AVueConstructorOptions {
  prioritySchema: boolean;
  silent: boolean;
}

export type AVueFlow<T> = {
  (flowPath: string, value: any, options: AVueConstructorOptions): void;
  [metaParam: string]: AFlow<any>;
} & T;

export declare interface AVueActions {
  launch(actionPath: string, ...args): Promise<any> | any;

  state: { [flowName: string]: any };
  during: { [actionPath: string]: boolean };
}

declare module "vue/types/vue" {
  interface Vue {
    $a: AVueActions;
  }

  interface VueConstructor {
    $a: AVueActions;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    mapFlow?: { [propNameOrModuleName: string]: string[] | string };
    onFlow?: { [flowPath: string]: (...dataValues) => void };
  }
}
