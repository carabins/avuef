import {A} from "../src";


function coreFlow(cl) {
  cl.x = "wok"
  return cl
}



export default class FlowStore {
  rootNode = A.f("x_z")
  mod = {
    x: A.f,
    quad: A.f,
    sub: {
      r: A.f
    }
  }
}

// Object.assign(FlowStore,{
//   x:'?'
// })