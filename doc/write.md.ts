import {writeFileSync} from "fs";

export const writeMD = data => {
  let md = ""
  data.forEach(o => {

    switch (o.type){
      case "param":
        md += `## ${o.name}
${o.info}
`
        break
      case "group":
        md += `## ${o.name}
${o.info?o.info:''}
`
        o.obj.forEach(oo=>{
          md += `#### ${oo.name} 
${oo.info}
`
        })
    }
  })
  writeFileSync("doc.md", md)
}