import {getTransformXY} from './Utils'
import {getDatas, getUnionDatas} from '../ModelConf'
// 动态扩展svg workbench 大小
export function checkNodePosition(svg, childSVGConf, render, forceRerende = true) {
    let cX = childSVGConf.x
    let cY = childSVGConf.y
    let cW = childSVGConf.width
    let cH = childSVGConf.height * 2

    let nW = parseFloat(svg.attr('width'))
    let nH = parseFloat(svg.attr('height'))
    let trans = getTransformXY(svg)
    let needChange = false
    let dX = 0, dY = 0
    if(cX < cW) {
        nW += cW
        trans.x = trans.x - cW
        dX = cW
        needChange = true
    } else if(cX + cW * 2 > nW) {
        nW += cW
        needChange = true
    }
    if(cY < cH) {
        nH += cH
        trans.y = trans.y - cH
        dY = cH
        needChange = true
    } else if(cY + cH * 2 > nH) {
        nH += cH
        needChange = true
    }
    if(needChange) {
        svg.attr('width', nW)
        .attr('height', nH)
        .attr('transform', 'translate(' + trans.x + ',' + trans.y + ')')

        getDatas().forEach(item => {
            item.x += dX
            item.y += dY
        })
        getUnionDatas().forEach(item => {
            item.x += dX
            item.y += dY
        })
        render()
    } else if(forceRerende) {
        render()
    }
}