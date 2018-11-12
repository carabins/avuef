import {graph} from "./graph";
import {isBrowser} from "./utils/context";

let canlog = true
export const Aloger = {
  silent() {
    canlog = false
  },
  simple: v => {
    if (canlog) console.log(v)
  },
  group: (title, params) => {
    if (canlog) {
      if (isBrowser)
        if (params.length > 1) {
          console.groupCollapsed(title)
          params.forEach(v=>console.log(v))
          console.groupEnd()
        } else {
          console.log(title)
        }
      else
        console.log(title)
    }
  },
  flow: (context)=> new Proxy({},{

  })
}
