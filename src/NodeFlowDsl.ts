const ext = new Set(['valueOf'])

export const alakProps = new Set(['stateless', 'emitter', 'immutable'])
const allowMethods = new Set(['value', 'start'])
const allowEdges = new Set(['born', 'wrap', 'bind', 'in', 'out'])

const deepHandler = {
  get(target, key) {
    switch (key) {
      case 'props':
      case 'edges':
      case 'methods':
        return target[key]
      case 'isNode':
        return true
    }
    let edges = target.edges

    switch (typeof key) {
      case 'string':
        if (allowMethods.has(key)) {
          return (...a) => {
            target.methods[key] = a
            return target.deep
          }
        } else if (allowEdges.has(key)) {
          return (...args) => {
            edges[key] = args
            return target.deep
          }
        } else if (!ext.has(key)) {
          target.props.push(key)
        }
        break
    }
    return target.deep
  }
}

const startHandler = {
  get(__, key) {
    let fn: any = (...args) => {
      fn.v = args
      return fn.deep
    }
    __.fn = fn
    fn.fn = fn
    fn.props = []
    fn.methods = {}
    fn.edges = {}
    fn.deep = new Proxy(fn, deepHandler)
    return fn.deep[key]
  }
}

function dslProxy(...args) {
  return this.fn(...args)
}

export const NodeFlowDsl = new Proxy(dslProxy, startHandler)
