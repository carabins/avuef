export const actionModules = (a, f) => ({
  entry() {
    console.log(f.rootNode.v)
    f.mod.sub.r.on(v => a("logResult", v))
  },
  logResult: v => console.log("result", v),
  mod: {
    quad: v => v * v,
    getX: () => 10,
    sub: {
      add: v => v + v,
      deepFn(v) {
        let r = a("mod.sub.add", v)
        f("mod.x", 11) // изменяет узел не вызывая изменения дочерних узлов
        return r
      }
    }
  }
})