export const graph = {
  flow: {} as any,
  flowMap: {} as any,
  mutations: {},
  lazyActions: new WeakMap(),
  edges: {
    wrap: [],
    bind: [],
    born: [],
    in: [],
    out: [],
  }
}
