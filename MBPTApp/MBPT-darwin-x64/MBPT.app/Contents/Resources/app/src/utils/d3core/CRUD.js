import {getDatas, getUnionDatas, getLinks, spliceData, spliceUnionData, spliceLink} from './ModelConf'
import {getNodeDataById} from './UI/Utils'
function getLinkIds(links, id) {
    let res = -1
    links.forEach((l, i) => {
        if(l.source === id || l.target === id) {
            res = i
            return
        }
    })
    return res
}
function getLinkBySource(links, id) {
    let res = -1
    links.forEach((l, i) => {
        if(l.source === id) {
            res = i
            return
        }
    })
    return res
}

function getLinkByTarget(links, id) {
    let res = -1
    links.forEach((l, i) => {
        if(l.target === id) {
            res = i
            return
        }
    })
    return res
}

function deleteTopLinks(id) {
    let needDelParentNode = []
    let index = getLinkByTarget(getLinks(), id)
    while(index >= 0) {
        let source = getNodeDataById(getLinks()[index].source)
        if(source && source.type === 'Union') {
            needDelParentNode.push(source.id)
        }
        spliceLink(index, 1)
        index = getLinkByTarget(getLinks(), id)
    }
    return needDelParentNode
}
function deleteBottomLinks(id) {
    let bottomIds = []
    let index = getLinkBySource(getLinks(), id)
    while(index >= 0) {
        bottomIds.push(getLinks()[index].target)
        spliceLink(index, 1)
        index = getLinkBySource(getLinks(), id)
    }
    return bottomIds
}
function delUNode(id, delList) {
    let del = false
    getDatas().forEach((d, i) => {
        if(d.id === id) {
            if(d.type !== 'DataSource') {
                delList.push(d._workConf.tableName)
            } else {
                delList.push(d._workConf.viewTableName)
            }
            spliceData(i, 1)
            del = true
            return
        }
    })
    if(del) {
        return
    }
    getUnionDatas().forEach((d, i) => {
        if(d.id === id) {
            spliceUnionData(i, 1)
            return
        }
    })
}
function del(id, delList) {
    let ndl = deleteTopLinks(id)
    let dBis = deleteBottomLinks(id)
    delUNode(id, delList)
    dBis.forEach(a => {
        del(a, delList)
    })
    ndl.forEach(a => {
        del(a, delList)
    })
}
export function deleteNode(id, call) {
    let delList = []
    del(id, delList)
    call(delList)
}