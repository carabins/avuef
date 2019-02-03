let isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

let isServer = !isBrowser()

export class LoStorage {
  static setItem(key, item) {
    if (isServer) return false
    else return localStorage.setItem(key, JSON.stringify(item))

  }

  static getItem(key): any {
    if (isServer) return false
    let v = localStorage.getItem(key)
    if (v) {
      return JSON.parse(v)
    }
    return false
  }

  static restoreState(key, state): any {
    if (isServer) return false
    let v = localStorage.getItem(key)
    if (v && v!='undefined') {
      state[key] = JSON.parse(v)
    }
  }
  static restoreFlow(id, flow): any {
    if (isServer) return false
    let v = localStorage.getItem(id)
    if (v && v!='undefined') {
      flow.o.lc = "restored"
      flow(JSON.parse(v))
    }
  }
  static clear(){
    if (isServer) return false
    localStorage.clear()
  }
}
