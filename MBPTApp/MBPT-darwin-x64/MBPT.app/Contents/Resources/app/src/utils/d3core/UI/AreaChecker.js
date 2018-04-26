import {getTransformXY} from './Utils'
import {getDatas, getUnionDatas} from '../ModelConf'
// 动态扩展svg workbench 大小
export function checkNodePosition(target, svg, childSVGConf, render, forceRerende = true) {
    let cX = childSVGConf.x
    let cY = childSVGConf.y
    let cW = childSVGConf.width
    let cH = childSVGConf.height * 2

    let nW = parseFloat(svg.attr('width'))
    let nH = parseFloat(svg.attr('height'))
    let trans = getTransformXY(svg)
    let needChange = false
    let dX = 0, dY = 0

    let containerWidth = target.domOutContainer.clientWidth
    let containerHeight = target.domOutContainer.clientHeight
    console.log(cY)
    console.log(cH)
    console.log(nH)
    if(cX < cW) { // 左边剩下不到模型的宽度，扩展一个宽度
        nW += cW
        trans.x = trans.x - cW
        dX = cW
        needChange = true
    }  else if(cX + cW * 2 > nW) { // 右边剩下不到模型的宽度，扩展
        nW += cW
        needChange = true
    } 
    /*
    if (cX > cW * 3) { // 左边剩下宽度大于三个模型宽度，且左边有平移， 收缩一个宽度
        if(trans.x + cW < 0) {
            nW -= cW
            trans.x = trans.x + cW
            dX = -cW
        } else { // svg原来平移不到一个宽度，直接设置平移为0
            nW += trans.x
            dX = trans.x
            trans.x = 0
        }
        needChange = true
    } else if(cX + cW * 4 < nW) { // 右边剩下宽度大于三个模型宽度，且左边有平移， 收缩一个宽度
        if(trans.x + nW - containerWidth > cW) {// 右边有足够多余的空间， 直接减少宽度
            nW -= cW
        } else {
            nW = containerWidth - trans.x
        }
        needChange = true
    }
    */
    if(cY < cH) { // 模型上部剩余不到一个高度
        nH += cH
        trans.y = trans.y - cH
        dY = cH
        needChange = true
    } else if(cY + cH * 2 > nH) { // 模型下部剩余不到一个高度
        nH += cH
        needChange = true
    }
    
    /*
    if(cY > 3 * cH) { // 模型上部剩余超过三个高度，收缩一个高度
        if(trans.y + cH < 0) { // 有足够空间
            nH -= cH
            trans.y = trans.y + cH
            dY = -cH
        } else {
            nH += trans.y
            dY = trans.y
            trans.y = 0
        }
        needChange = true
    } else if(cY + cH * 4 < nH) { // 模型下部剩余超过三个高度，收缩一个高度
        if(trans.y + nH - containerHeight > cH) {// 下面有足够多余的空间， 直接减少宽度
            nH -= cH
        } else {
            nW = containerHeight - trans.y
        }
        needChange = true
    }*/
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