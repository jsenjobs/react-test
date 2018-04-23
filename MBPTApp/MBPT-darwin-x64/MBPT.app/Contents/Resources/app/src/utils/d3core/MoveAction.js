
import {getDatas, getLinks, getCenter} from './ModelConf'
import {checkNodePosition} from './UI/AreaChecker'
import {getNodeDataById} from './UI/Utils'

const d3 = require('d3')
// const w = rect.width + container.padding * 2
// const h = rect.height + container.padding * 2 + circle.r * 2

let CanDrag = true
export function setCanDrag(canDrag) {
    CanDrag = canDrag
}
export function getCanDrag() {
    return CanDrag
}
export function dragStart(self, d, target) {
    if(!CanDrag) return
    // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    let node = d3.select(self)
    node.attr('style', 'cursor:move')
    node.raise().classed('node-drag', true)
}

export function drag(d) {
    if(!CanDrag) return
    let node = d3.select(this)
    d.x = d3.event.x
    d.y = d3.event.y
    let dX = d3.event.dx
    let dY = d3.event.dy
    node.attr('x', d.x).attr('y', d.y)


    d3.select('.links')
        .selectAll("path")
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
            } else {
                return {
                    x: tD.x + tD.width / 2 + tD.padding,
                    y: tD.y + tD.r + tD.padding
                }
            }
        }).x(d => d.x).y(d => d.y))

        d3.select('.labels').selectAll('g').select('text')
        .attr('x', d => getCenter(d.source, d.target).x)
        .attr('y', d => getCenter(d.source, d.target).y)
}

export function dragEnd(self, target) {
    if(!CanDrag) return
    // if (!d3.event.active) simulation.alphaTarget(0);
    let node = d3.select(self)
    node.attr('style', 'cursor:default')
    node.classed('node-drag', false)

    checkNodePosition(target._hock.workBench, self.__data__, target.renderD3, false)
}

export function updatePosition(svg, attrs) {
    if(svg)
        svg
            .attr('x', attrs.x - parseFloat(svg.attr('width')) / 2)
            .attr('y', attrs.y - parseFloat(svg.attr('height')) / 2)
}