export function updateExecResult(target, data, currentSelectNode) {
    let execResult = target.state.execResult
    execResult[currentSelectNode] = data
    // console.log(data)
    target.setState({execResult})
}

export function clearSelect(target) {
    target.setState({currentSelectedNode: null, currentSelectedNodeConf: null})
}