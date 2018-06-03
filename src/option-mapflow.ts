import {graph} from "./graph";
import {getFlowData} from "./utils";

export const optionMapflow = (mapCleaner, comp, toData, params) => {
  let cleanFns: any[] = []
  let dataObject = {}
  let compName = comp._componentTag
  const mutatePatch = (fullPath, targetKey) => {
    let path = fullPath.split('.')

    let mutatePath = graph.mutations as any
    path.forEach(p => {
      if (mutatePath[p]) {
        mutatePath = mutatePath[p]
      }
    })

    if (!mutatePath.add) {
      console.warn(`[mutatePath] '${fullPath}' not found in`, compName)
      return
    }

    let mutator = (value = undefined) => {
      let {flow, isFullPatch, lastI} = getFlowData(path, graph.flow, value)


      if (flow.isMeta("lazy")) {
        // console.log("Ω", graphEdges.lazyEdges.has(flow), graphEdges.lazyEdges.get(flow), fullPath)
        if (graph.lazyActions.has(flow))
          graph.lazyActions.get(flow)(`𝝭' `+compName)
      }


      // if (value != null) {
      value = value ? value : flow[flow.isMeta("mutable") ? "v" : "imv"]
      // }
      if (!isFullPatch) {
        let missPath = path.slice(lastI)
        if (value)
          missPath.forEach(p => {
            value = value[p]
          })
      }
      // console.log("Ω",fullPath, toData.has(comp),  value)
      if (toData.has(comp)) {
        comp.$set(comp, targetKey, value)
      } else {
        comp[targetKey] = dataObject[targetKey] = value
      }

    }
    mutator()

    mutatePath.add(mutator)
    cleanFns.push(() => mutatePath.delete(mutator))
  }
  Object.keys(params).forEach(k => {
    let pValue = params[k]
    let typeOfParams = Array.isArray(pValue) ? "array" : typeof pValue
    switch (typeOfParams) {
      case "string":
        mutatePatch(pValue, k)
        break
      case "array":
        // console.log("array")
        let flow = graph.flow[k]
        if (flow) {
          if (pValue.length == 0) pValue = Object.keys(flow)
          pValue.forEach(v => {
            mutatePatch(k + "." + v, v)
          })
        } else {
          console.warn(`Flow "${k}" not found for component: '${compName}'`)
        }
        break
    }
  })
  mapCleaner.set(comp, () => {
    cleanFns.forEach(f => f())
    // toData.delete(comp)
  })
  // Object.assign(comp, dataObject)
  toData.set(comp, dataObject)
  return dataObject
}