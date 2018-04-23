import {getDatas, getUnionDatas} from '../ModelConf'

export function getTransformXY(svg) {
    if(!svg) {
        return {x:0, y:0}
    }
    let trans = svg.attr('transform')
    if(trans) {
        trans = trans.split(/,|\(|\)/)
        return {
            x: parseInt(trans[1]),
            y: parseInt(trans[2])
        }
    }
    return {x:0, y:0}
}

export function getNodeDataById(id) {
    let result = null
    getDatas().forEach(item => {
        if(item.id === id) {
            result = item
            return
        }
    })
    if(!result) {
        getUnionDatas().forEach(item => {
            if(item.id === id) {
                result = item
                return
            }
        })
    }
    return result
}