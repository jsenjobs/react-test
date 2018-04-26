import {getNodeDataById} from './Utils'
import {getDatas, getLinks, addLink} from '../ModelConf'
import {showDelNodeModal} from '../Change/ModalHelp'
import {checkRule} from '../RuleChecker'
import {dragStart, drag, dragEnd, setCanDrag, getCanDrag} from '../MoveAction'
import {mouseover, mouseout} from '../MouseAction'
import testSVG from '../../../component/part/svg/unionAll.svg'
var d3 = require('d3')

export function CreateNode(target, parent) {
    let hock = target._hock
    // update
    let updateNode = parent
    updateNode
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    updateNode.select('.content')
    .style("fill", d => d.color)
    updateNode.select('text')
    .text(d => d.text)
    updateNode.select('.zi')
    .attr('fill-opacity', 0)
    updateNode.select('.tzi')
    .attr('fill-opacity', 0)
    updateNode.select('.shua')
    .attr('fill-opacity', 0)
    updateNode.select('.tshua')
    .style("text-anchor", 'middle')
    updateNode.select('.yi')
    .attr('fill-opacity', 0)
    updateNode.select('.tyi')
    .style("text-anchor", 'middle')
    updateNode.select('.top')
    .style("fill", d => d.dColor)
    updateNode.select('.bottom')
    .style("fill", d => d.dColor)

    let enterNode = parent.enter().append('svg')
    .attr('class', 'container')
    .attr('filter', 'url(#svg-shadow-2px)')
    .attr('width', d => d.width + d.padding * 2)
    .attr('height', d => d.height + d.r * 2 + d.padding * 2)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .on('mousedown', d => {
        console.log(d)
        target.changeSelectedNode(d)
    })
    .call(d3.drag()
        .on('start', function(d) {
            dragStart(this, d, target)
        })
        .on('drag', drag)
        .on('end', function() {
            dragEnd(this, target)
        })
    )
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

    enterNode.append('circle')
    .attr('r', d => d.r)
    .attr('class', 'top')
    .attr('cx', d => d.width / 2 + d.padding)
    .attr('cy', d => d.r + d.padding)
    .attr("fill", d => d.dColor)
    .on('mouseenter', target.onCircleMouseEnterTarget)


    enterNode.append('circle')
    .attr('r', d => d.r)
    .attr('class', 'bottom')
    .attr('cx', d => d.width / 2 + d.padding)
    .attr('cy', d => d.height + d.r + d.padding)
    .attr("fill", d => d.dColor)
    .on('mouseenter', function () {
        d3.select(this).style('cursor', 'crosshair')
    })
    .on('mouseout', function () {
        d3.select(this).style('cursor', 'default')
    })
    .call(d3.drag()
        .on('start', d => {
            setCanDrag(false)
            hock.triggerSourceNode = d
            let x = d3.event.x + d.width / 2 + d.padding
            let y = d3.event.y + d.height + d.padding + d.r
            hock.triggerPath = d3.select('.links').append("path")
                .attr('source', d.id)
                .attr('class', "link")
                .style("stroke","#345678")
                .style("stroke-width",3)
                .attr('source-x', x)
                .attr('source-y', y)
                .attr('d', d3.linkHorizontal()({
                    source: [x, y],
                    target: [x, y]
                }))
        })
        .on('drag', d => {
            if(!getCanDrag() && hock.triggerPath) {
                let x = d3.event.x + d.width / 2 + d.padding
                let y = d3.event.y + d.height + d.padding + d.r
                /*
                hock.triggerPath.attr('x2', x).attr('y2', y)
                */
               hock.triggerPath
                .attr('d', d3.linkHorizontal()({
                    source: [hock.triggerPath.attr('source-x'), hock.triggerPath.attr('source-y')],
                    target: [x, y]
                }))
            }
        })
        .on('end', _ => {
            setCanDrag(true)
            if(hock.triggerPath) {
                hock.triggerPath.remove()
                hock.triggerPath = null
            }
        })
    )

    enterNode.append('rect')
    .attr('class', 'content')
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('x',  d => d.padding)
    .attr('y', d => d.r + d.padding)
    .attr('rx', d => d.ry)
    .attr('ry', d => d.ry)
    .style("fill", d => d.color)
    enterNode.append('text')
    .attr('x', d => d.width / 2 + d.padding)
    .attr('y', d => d.height / 2 + d.r + d.padding)
    .text(d => d.text)
    .style("text-anchor", 'middle')
    .style("dominant-baseline", "middle")

    let p1 = enterNode.append('path')
    .attr('class', 'func zi')
    .attr('d', d => {
        let r = d.r,
        top1 = d.padding + r,
        top2 = top1 + r,
        left1 = d.padding,
        left2 = left1 + r,
        bottom1 = top1 + d.height / 2,
        right1 = left1 + d.width / 3
        let pathD = `M${right1} ${top1} L${right1} ${bottom1} L${left1} ${bottom1} L${left1} ${top2} A${r} ${r},0,0,1,${left2} ${top1}`
        return pathD
    })
    .attr('fill-opacity', 0)
    .on('mouseenter', _ => p1.style('cursor', 'pointer') )
    .on('mouseout', _ => p1.style('cursor', 'default') )
    .on('click', d => {
        target.setState({visibleSelfCalModal:true})
        hock.triggerSourceNode = d
    })
    let t1 = enterNode.append('text')
    .attr('class', 'funct tzi')
    .attr('x', d => d.width / 6 + d.padding)
    .attr('y', d => d.height / 4 + d.r + d.padding)
    .attr('fill-opacity', 0)
    .text('自运算')
    .style("text-anchor", 'middle')
    .style("dominant-baseline", "middle")
    .on('mouseenter', _ => t1.style('cursor', 'pointer') )
    .on('mouseout', _ => t1.style('cursor', 'default') )
    .on('click', d => {
        target.setState({visibleSelfCalModal:true})
        hock.triggerSourceNode = d
    })


    let p2 = enterNode.append('path')
    .attr('class', 'func shua')
    .attr('d', d => {
        let r = d.r,
        top1 = d.padding + r,
        left1 = d.padding + d.width / 3,
        bottom1 = top1 + d.height / 2,
        right1 = left1 + d.width / 3
        let pathD = `M${left1} ${top1}L${right1} ${top1}L${right1} ${bottom1}L${left1} ${bottom1}`
        return pathD
    })
    .attr('fill-opacity', 0)
    .on('mouseenter', _ => p2.style('cursor', 'pointer') )
    .on('mouseout', _ => p2.style('cursor', 'default') )
    .on('click', d => {
        alert('refresh')
    })
    let t2 = enterNode.append('text')
    .attr('class', 'funct tshua')
    .attr('x', d => d.width / 2 + d.padding)
    .attr('y', d => d.height / 4 + d.r + d.padding)
    .attr('fill-opacity', 0)
    .text('刷新')
    .style("text-anchor", 'middle')
    .style("dominant-baseline", "middle")
    .on('mouseenter', _ => t2.style('cursor', 'pointer') )
    .on('mouseout', _ => t2.style('cursor', 'default') )
    .on('click', d => {
        alert('refresh')
    })

    let p3 = enterNode.append('path')
    .attr('class', 'func yi')
    .attr('d', d => {
        let r = d.r,
        top1 = d.padding + r,
        top2 = top1 + r,
        left1 = d.padding + d.width * 2 / 3,
        bottom1 = top1 + d.height / 2,
        right1 = left1 + d.width / 3,
        right2 = right1 - r
        let pathD = `M${left1} ${top1}L${right2} ${top1}A${r} ${r},0,0,1,${right1} ${top2} L${right1} ${bottom1} L${left1} ${bottom1}}`
        return pathD
    })
    .attr('fill-opacity', 0)
    .on('mouseenter', _ => p3.style('cursor', 'pointer') )
    .on('mouseout', _ => p3.style('cursor', 'default') )
    .on('click', d => {
        showDelNodeModal(target, d)
    })
    let t3 = enterNode.append('text')
    .attr('class', 'funct tyi')
    .attr('x', d => d.width * 5 / 6 + d.padding)
    .attr('y', d => d.height / 4 + d.r + d.padding)
    .attr('fill-opacity', 0)
    .text('移除')
    .style("text-anchor", 'middle')
    .style("dominant-baseline", "middle")
    .style('pointer-events', 'none')
    .on('mouseenter', _ => t3.style('cursor', 'pointer') )
    .on('mouseout', _ => t3.style('cursor', 'default') )
    /*.on('click', d => {
        deleteNode(d.id, _ => {
            target.renderD3()
        })
    })*/

    // enter

    // exit
    let exitNode = parent.exit()
    exitNode.remove()
}

export function CreateUnionNode(target, parent) {
    let hock = target._hock
    // update
    let updateNode = parent
    updateNode
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    updateNode.select('.content')
    .attr("fill", d => d.dColor)
    updateNode.select('text')
    .text(d => d.text)

    let enterNode = parent.enter().append('svg')
    .attr('class', 'container')
    .attr('filter', 'url(#svg-shadow-2px)')
    .attr('width', d => d.outR * 2 + d.padding * 2)
    .attr('height', d => d.outR * 2 + d.padding * 2)
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .on('mousedown', d => {
        target.changeSelectedNode(d)
    })
    .call(d3.drag()
        .on('start', function(d) {
            dragStart(this, d, target)
        })
        .on('drag', drag)
        .on('end', function() {
            dragEnd(this, target)
        })
    )
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)

    enterNode.append('circle')
    .attr('class', 'content')
    .attr('cx',  d => d.padding + d.outR)
    .attr('cy', d => d.outR + d.padding)
    .attr('r', d => d.outR)
    .attr("fill", d => d.dColor)
    enterNode.append('text')
    .attr('x', d => d.width / 2 + d.padding)
    .attr('y', d => d.height / 2 + d.padding)
    .text(d => d.text)
    .style("text-anchor", 'middle')
    .style("dominant-baseline", "middle")

    // enter

    // exit
    let exitNode = parent.exit()
    exitNode.remove()

}

export function CreateLink(parent) {
    let updateLink = parent
    // update
    updateLink
    .attr('d', d3.linkHorizontal().source(d => {
        let sD = getNodeDataById(d.source)
        return {
            x: sD.x + sD.width / 2 + sD.padding,
            y: sD.y + sD.r + sD.padding + sD.height
        }
    }).target(d => {
        let sD = getNodeDataById(d.source)
        let tD = getNodeDataById(d.target)
        if(tD.type === 'Union') {
            if(sD.x <= tD.x) {
                return {
                    x: tD.x + tD.width / 2 + tD.padding - 0.866 * tD.outR,
                    y: tD.y + tD.r + tD.padding + 0.5 * tD.outR
                }
            } else {
                return {
                    x: tD.x + tD.width / 2 + tD.padding + 0.866 * tD.outR,
                    y: tD.y + tD.r + tD.padding + 0.5 * tD.outR
                }
            }
        }
        return {
            x: tD.x + tD.width / 2 + tD.padding,
            y: tD.y + tD.r + tD.padding
        }
    }).x(d => d.x).y(d => d.y))


    // enter
    let enterLink = parent.enter()
    enterLink.append('path')
    .attr('class', 'link')
    // .attr('filter', 'url(#svg-shadow-2px)')
    .style("stroke","#998877")
    .style("stroke-width",1.4)
    .attr('d', d3.linkHorizontal().source(d => {
        let sD = getNodeDataById(d.source)
        return {
            x: sD.x + sD.width / 2 + sD.padding,
            y: sD.y + sD.r + sD.padding + sD.height
        }
    }).target(d => {
        let sD = getNodeDataById(d.source)
        let tD = getNodeDataById(d.target)
        if(tD.type === 'Union') {
            if(sD.x <= tD.x) {
                return {
                    x: tD.x + tD.width / 2 + tD.padding - 0.866 * tD.outR,
                    y: tD.y + tD.r + tD.padding + 0.5 * tD.outR
                }
            } else {
                return {
                    x: tD.x + tD.width / 2 + tD.padding + 0.866 * tD.outR,
                    y: tD.y + tD.r + tD.padding + 0.5 * tD.outR
                }
            }
        }
        return {
            x: tD.x + tD.width / 2 + tD.padding,
            y: tD.y + tD.r + tD.padding
        }
    }).x(d => d.x).y(d => d.y))

    // exit
    let exitLink = parent.exit()
    exitLink.remove()
}

export function CreateLabel(parent) {
    // update
    let updateLabel = parent
    updateLabel
    .select('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .text(d => d.text)

    // enter
    let enterLabel = parent.enter()
    enterLabel.append('g')
    .attr('class', 'g-label')
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('text-anchor', 'middle')
    .style("dominant-baseline", "middle")
    .text(d => d.text)

    // exit
    let exitLabel = parent.exit()
    exitLabel.remove()
}