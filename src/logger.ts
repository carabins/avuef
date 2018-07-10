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
      if (params.length > 1) {
        console.groupCollapsed(title)
        params.forEach(console.log)
        console.groupEnd()
      } else {
        console.log(title)
      }
    }
  }
}