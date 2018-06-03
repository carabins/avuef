const handler = {
  get(target, key) {
    let t = target
    if (target.isFlow) {
      t = target.v
    }
    let v = t[key]
    if (v.isFlow) {
      v = v.v
    }
    if (typeof v == 'object') {
      return deepProxy(v)
    }
    return v
  }
}

const deepProxy = o => new Proxy(o, handler)


export function proxyState(flow) {
  return deepProxy(flow)
}