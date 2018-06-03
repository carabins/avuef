import {AVueAction} from "avuef";
import FlowSchema from "../flow-schema";

export default (a: AVueAction, f: FlowSchema) => ({
  ok(){
    console.log("im a ok")
  },
  actions(){
    console.log("im a action in index")
  }
})