export const graph = {
  flow: {} as any,
  flowMap: {} as any,
  mutations: {},
  lazyActions: new WeakMap(),
  edges: {
    map: [],
    if: [],
    get: [],
    wrap: [],
    actions: [],
    from: []
  }
}
