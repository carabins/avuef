import {avue} from "./index";
import {AVue} from "../src";
import FlowStore from "./flowStore";


interface FF {
  ():void
  ok:string
}

function edgeFrom(classInstance, fn:FF) {

}


export const edges = edgeFrom(FlowStore, function() {

})