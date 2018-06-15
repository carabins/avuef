import {readFileSync} from "fs";
import {TypescriptParser} from "typescript-parser";
import {writeMD} from "./write.md";


let def = readFileSync("index.d.ts").toString()


let lines = def.split('\n')


let tsp = new TypescriptParser()
tsp.parseSource(def).then(x => {
  let objects = []
  let globalObjects = []
  let groupObjects = []
  let currentObj
  let currentGroup
  let state = "skip"
  lines.forEach(l => {
    if (l.indexOf("/**") >= 0) {
      state = "start"
    }
    if (l.indexOf("*/") >= 0) {
      state = "end"
    }
    if (l.indexOf("//--") >= 0) {
      state = "groupname"
      globalObjects = objects.slice()
      objects = groupObjects = []
      currentGroup = {}
      globalObjects.push(currentGroup)
      currentGroup.type = "group"
      currentGroup.name = l.split("//--")[1]

    }
    if (l.indexOf("//*") >= 0) {
      state = "group"
      let v = l.split("//*")[1]
      currentGroup.info = currentGroup.info ? currentGroup.info + '\n' + v : v
    }
    if (l.indexOf("///-") >= 0) {
      state = "groupend"
      currentGroup.obj = objects.slice()
      objects = globalObjects.slice()
    }
    switch (state) {
      case "start": {
        currentObj = {}
        currentObj.type = "param"
        state = "getInfo"
        break
      }
      case "getInfo": {
        // console.log(l)
        currentObj.info = currentObj.info ? currentObj.info + '\n' + l.split("*")[1] : l.split("*")[1]
        break
      }
      case "end": {
        objects.push(currentObj)
        state = "getName"
        break
      }
      case "getName": {
        currentObj.name = l
        state = "x"
        break
      }
    }
  })
  writeMD(objects)

})

