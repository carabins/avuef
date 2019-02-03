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

export function wayTo(path, inObject) {

  let lo = inObject
  let wrong = false
  path.forEach(p => {

    if (lo != undefined && lo[p]) {
      lo = lo[p]
    } else {
      wrong = true
    }
  })
  return wrong ? null : lo
}

export function getFlowData(pathArray, stateFlow, inValue) {

  let lastI
  let lastFlow = stateFlow
  let flow = stateFlow
  let flowPath = []
  pathArray.forEach((p, i) => {
    if (flow != undefined && flow.hasOwnProperty(p)) {
      flow = flow[p]
      flowPath.push(flow)
    }
  })
  let i = flowPath.length
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
