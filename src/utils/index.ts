export function pathTo(path, inObject) {
  let pa = path.split(".")
  let lo = inObject
  let wrong = false
  pa.forEach(p => {

    if (lo != undefined && lo[p]) {
      lo = lo[p]
    } else {
      wrong = true
    }
  })
  return wrong ? !wrong : lo
}

export function getFlowData(pathArray, stateFlow, inValue) {
  // console.log("getFlowData.start")

  let lastI
  let lastFlow = stateFlow
  let flow = stateFlow
  let flowPath = []
  // console.log("getFlowData", pathArray)
  pathArray.forEach((p, i) => {
    // console.log(i, p, flow != undefined && flow.hasOwnProperty(p))
    if (flow != undefined && flow.hasOwnProperty(p)) {
      flow = flow[p]
      flowPath.push(flow)
    }
  })
  let i = flowPath.length
  // console.log("flowPath.length", i)
  while (i--) {
    lastFlow = flowPath[i]
    if (lastFlow.isFlow) {
      lastI = i+1
      break
    }
  }
  let isFullPatch = pathArray.length == (lastI)
  return {
    isFullPatch, flow:lastFlow, lastI
  }
}

// export const userControls = ()=> [flowGraph.flow, actions.newDispatcher, flowGraph.data]
