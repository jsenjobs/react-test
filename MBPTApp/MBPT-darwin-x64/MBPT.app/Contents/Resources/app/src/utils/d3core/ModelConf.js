import {getNodeDataById} from './UI/Utils'

var Datas = []
var UnionDatas = []
/*
{
    width: rect.width,
    height: rect.height,
    rx: rect.rx,ry:rect.ry,
    x:200,y:200,
    id: uuid(),
    fill:'red'
}
 */
var Links = []
export function setDatas(datas) {
    Datas = datas
}
export function addData(data) {
    Datas.push(data)
}

export function updateValueById(id, key, value) {
    Datas.every(d => {
        if(d.id === id) {
            d[key] = value
            return
        }
    })
}

export function getDatas() {
    return Datas
}
export function setUnionDatas(datas) {
    UnionDatas = datas
}
export function addUnionData(data) {
    UnionDatas.push(data)
}

export function getUnionDatas() {
    return UnionDatas
}


export function spliceData(i, l) {
    Datas.splice(i, l)
}

export function spliceUnionData(i, l) {
    UnionDatas.splice(i, l)
}

export function addLink(link) {
    Links.push(link)
}
export function setLinks(links) {
    Links = links
}
export function getLinks() {
    return Links
}

export function getLinkCenter() {
    return Links.map(link => getCenter(link.source, link.target))
}
export function getCenter(source, target) {
    let sD = getNodeDataById(source)
    let tD = getNodeDataById(target)
    return {x: (sD.x + sD.width / 2 + sD.padding + tD.x + tD.width / 2 + tD.padding) / 2, 
        y: (sD.y + sD.padding + sD.r + sD.height + tD.y + tD.padding + tD.r) / 2, source:source, target:target,
        text: tD.text
    }
}
export function spliceLink(i, l) {
    Links.splice(i, l)
}

export function removeAll() {
    Datas = []
    Links = []
    UnionDatas = []
}