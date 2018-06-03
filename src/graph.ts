export const graph = {
  flow: {} as any,
  mutations: {},
  lazyActions: new WeakMap(),
  edges: {
    map: [],
    if: [],
    get: [],
    on: []
  }
}