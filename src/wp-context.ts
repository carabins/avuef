export function wpContext(context) {
  if (context.keys && context.keys()) {
    let keys = context.keys()
    let mpath = keys.map(k => ({ k, n: k.replace('./', '') })) ///.replace(new RegExp('/', 'g'), "."))
    let modules = {}
    mpath.forEach(k => {
      let ma = k.n.split('/')
      let nameParts = ma.pop().split('.')
      if (nameParts.length > 1) {
        let name = nameParts[0]
        let path = './' + k.n.split('.')[0]
        if (name)
          if (ma.length > 0) {
            let a = ma[0]
            let m = (modules[a] = modules[a] ? modules[a] : {})
            if (ma.length > 1)
              for (let i = 1; i < ma.length; i++) {
                a = ma[i]
                m = m[a] = m[a] ? m[a] : {}
              }
            m[name] = { path, good: true, k: k.k }
          } else {
            modules[name] = { path, good: true, k: k.k }
          }
      }
    })

    const resolveModule = path => {
      let module = context(path).default
      module.path = path
      return module
    }
    let o = {}
    Object.keys(modules).forEach(k => {
      let m = modules[k]
      if (m.good) {
        o[k] = resolveModule(m.k)
      } else {
        if (m.index) {
          o[k] = resolveModule(m.index.k)
        } else {
          o[k] = resolveModule(m.k)
        }
      }
    })
    return o
  } else {
    return context
  }
}

export const webPackActions = context => {
  if (context.keys && context.keys())
    return function(...args) {
      let keys = context.keys()
      let mpath = keys.map(k => k.replace('./', '')) ///.replace(new RegExp('/', 'g'), "."))
      let modules: any = {}

      mpath.forEach(k => {
        let ma = k.split('/')
        let nameParts = ma.pop().split('.')
        if (nameParts.length > 1) {
          let name = nameParts[0]
          let path = './' + k.split('.')[0]
          if (name)
            if (ma.length > 0) {
              let a = ma[0]
              let m = (modules[a] = modules[a] ? modules[a] : {})
              if (ma.length > 1)
                for (let i = 1; i < ma.length; i++) {
                  a = ma[i]
                  m = m[a] = m[a] ? m[a] : {}
                }
              m[name] = path
            } else {
              modules[name] = path
            }
        }
      })

      let activeModules = {}
      const resolveModule = path => {
        let module: any = context(path).default
        module.path = path
        return (activeModules[path] = module)
      }

      let activeSubProxys = new Map()
      const makeProxy = (module, index?) =>
        new Proxy(module, {
          get(module, key: string) {
            let cmd = index && index[key] ? index[key] : null
            let subModule = module[key]
            let subProxy
            if (subModule) {
              if (activeSubProxys.has(subModule)) {
                return activeSubProxys.get(subModule)
              } else {
                let subIndex
                switch (typeof subModule) {
                  case 'object':
                    if (subModule.index) {
                      subIndex = resolveModule(subModule.index)
                    }
                    subProxy = makeProxy(subModule, subIndex)
                    break
                  default:
                    let actionModule = resolveModule(subModule)
                    subProxy = makeProxy({}, actionModule)
                    break
                }
                activeSubProxys.set(subModule, subProxy)
              }
            }
            if (cmd) {
              if (subProxy) {
                return Object.assign(cmd, subProxy)
              }
              return cmd
            }
            if (subProxy) {
              return subProxy
            }
            console.warn("unresolved module '", key, "' in ", module)
            return false
          }
        })

      return makeProxy(modules)
    }
  return false
}
