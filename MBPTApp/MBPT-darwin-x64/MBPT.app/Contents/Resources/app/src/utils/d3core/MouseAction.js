var d3 = require('d3')

export function mouseover(d) {
    let node = d3.select(this)
    node.style('cursor', 'move')
    node.selectAll('.func').attr('fill-opacity', 0.2)
    node.selectAll('.funct').attr('fill-opacity', 1)
}

export function mouseout(d) {
    let node = d3.select(this)
    node.style('cursor', 'default')
    node.selectAll('.func').attr('fill-opacity', 0)
    node.selectAll('.funct').attr('fill-opacity', 0)
}