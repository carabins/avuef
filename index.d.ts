import { AFlow } from "alak";
import Vue from "vue";

type AGraphNode = {
  global: AGraphNode;
  stored: AGraphNode;
  immutable: AGraphNode;
  stateless: AGraphNode;
  vuex: AGraphNode;
  emitter: AGraphNode;
  on: (parentFlowPath: string, actionPath: string) => AGraphNode;
  lazyOn: (parentFlowPath: string, actionPath: string) => AGraphNode;
  get: (actionPath: string) => AGraphNode;
  lazyGet: (actionPath: string) => AGraphNode;
  f: IA;
};

export declare interface IA {
  f: AFlow<any>;
  <T>(v: T): AFlow<T>;
}

export declare const F: AGraphNode;

export declare class AVue<T> {
  vuex: {
    store: (v) => void;
    schema: () => any;
  };
  a: AVueActions;
  f: AVueFlow<T>;

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
