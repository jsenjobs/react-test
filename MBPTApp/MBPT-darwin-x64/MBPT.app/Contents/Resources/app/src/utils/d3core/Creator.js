var d3 = require('d3')


export function Create() {
    return {
        Shotcut : function(svg, attrs, type, typeC) {
            let w = typeC.width + typeC.padding * 2
            let h = typeC.height + typeC.padding * 2 + typeC.r * 2
            let node = svg
                        .append('svg')
                        .attr('class', 'cut')
                        .attr('type', type)
                        .attr('width', w)
                        .attr('height', h)
                        .attr('x', attrs.x - w / 2)
                        .attr('y', attrs.y - h / 2)
                        .attr('fill-opacity', 0.5)
            node.append('rect')
                .attr('fill', typeC.color)
                .attr('width', typeC.width)
                .attr('height', typeC.height)
                .attr('rx', typeC.rx)
                .attr('ry', typeC.ry)
                .attr('x', typeC.padding)
                .attr('y', typeC.padding + typeC.r)
            node.append('circle')
                .attr('r', typeC.r)
                .attr('cx', w / 2)
                .attr('cy', typeC.r + typeC.padding)
                .style("fill", typeC.color)
            node.append('circle')
                .attr('r', typeC.r)
                .attr('cx', w / 2)
                .attr('cy', typeC.height + typeC.r + typeC.padding)
                .style("fill", typeC.color)
            return node
        },
        Node : function(N, render) {
        }
    }

}