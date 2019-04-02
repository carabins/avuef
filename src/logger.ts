import {isBrowser} from './utils/context'

let opt = {
  log: {
    action: false,
    flow: false
  }
}
export const Aloger = {
  opt,
  silent(v) {
    opt.log = v
  },
  simple: v => {
    if (opt.log) console.log(v)
  },
  group: (title, params) => {
    if (opt.log) {
      if (isBrowser)
        if (params.length >= 1) {
          console.groupCollapsed(title)
          params.forEach(v => console.log(v))
          console.groupEnd()
        } else {
          console.log(title)
        }
      else console.log(title)
    }
  },
  flow: context => new Proxy({}, {})
}
