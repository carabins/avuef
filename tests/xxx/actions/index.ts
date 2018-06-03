import {AVueAction} from "avuef";

export default (a: AVueAction, f) => ({
  ok(){
    console.log("im a ok in action")
  },
  actions(){
    console.log("im a action in action ")

  }
})