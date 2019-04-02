export const graph = {
  flow: {} as any,
  flowMap: {} as any,
  flowTop: {},
  mutations: {},
  lazyActions: new WeakMap(),
  edges: {
    wrap: [],
    bind: [],
    born: [],
    in: [],
    out: [],
    top: []
  }
}
