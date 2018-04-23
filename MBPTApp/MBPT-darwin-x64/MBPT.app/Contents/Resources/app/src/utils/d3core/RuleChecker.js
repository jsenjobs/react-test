
function checkExistLine(links, lineData) {
    let exist = false
    links.forEach(l => {
        if((l.source === lineData.source && l.target === lineData.target) || 
            (l.source === lineData.target && l.target === lineData.source)) {
                exist = true
                return
        }
    })
    return exist
}
export function checkRule(hook, datas, links, lineData, clear, call) {
    if(lineData.source === lineData.target) {
    } else if(checkExistLine(links, lineData)) {
        clear()
        alert('线段存在')
    } else {
        call()
        clear()
    }
}