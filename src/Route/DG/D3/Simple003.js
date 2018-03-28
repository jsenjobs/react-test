import React, {Component} from 'react'
// import * as d3 from 'd3'
import './style003.css'
import treeData from './treedata1.json'

var d3 = require('d3')
// d3.box = require('d3-box')
// d3.scale = require('d3-scale')

class Simple003 extends Component {
    render() {
        return (<div className="bar-chart--simple">
                <svg ref={(r) => this.chartRef = r}></svg>
        </div>)
    }
    componentDidMount() {
        setTimeout(_ => {
            this.renderD3()
        }, 50)
    }

    renderD3 = () => {
        const containerWidth = this.chartRef.parentElement.offsetWidth;
        const margin = { top: 80, right: 160, bottom: 80, left: 160 };
        const width = containerWidth - margin.left - margin.right;
        const height = 2160 - margin.top - margin.bottom;
        let chart = d3.select(this.chartRef).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);// 设置总宽高
        let g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // 设最外包层在总图上的相对位置

        let tree = d3.tree().size([height, width])// .separation((nodeA, nodeB) => nodeA.parent === nodeB.parent ? 1 : 2)


        let stratify = d3.stratify()
            .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

        d3.csv("/flare.csv").then(data => {
            var root = stratify(data).sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); })
            // console.log(root)
            _render(root, root)
        })

        function toggle(d) {
            
            if(d.children) {
                d.xxssdd = d.children
                d.children = null
            } else {
                d.children = d.xxssdd
                d.xxssdd = null
            }
        }


        function _render(root, source) {
            console.log(root)
            let linksData = tree(root).links()

            let node = g.selectAll('.node')
                .data(root.descendants())
            let enterN = node.enter()
            let exitN = node.exit()
            let enterNode = enterN.append('g')
                .attr('class', d => 'node' + (d.children? ' node--internal' : ' node--leaf'))
                .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')')
                .on('click', (d) => {
                    // console.log(d)
                    toggle(d)
                    _render(root, d)
                })
            enterNode.append('circle')
                .attr('r', 6)
            enterNode.append('text')
                .attr('dy', 3)
                .attr('x', d => d.children ? -8 : 8)
                .style('text-anchor', d => d.children ? 'end':'start')
                .text(d => d.id.substring(d.id.lastIndexOf('.') + 1))
           let updateNode = node.transition()
                .duration(0)
                .attr('class', d => 'node' + (d.children? ' node--internal' : ' node--leaf'))
                .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')')
            updateNode.select('circle').attr('r', 6)
            updateNode.select('text').style('fill-opacity', 1)
                .attr('x', d => d.children ? -8 : 8).style('text-anchor', d => d.children ? 'end':'start').text(d => d.id.substring(d.id.lastIndexOf('.') + 1))


            let exitNode = exitN.transition().duration(0).attr('transform', d => 'translate(' + source.y + ',' + source.x + ')').remove()
            exitNode.select('circle').attr('r', 0)
            exitNode.select('text').style('fill-opacity', 0)


            let links = g.selectAll('.link').data(linksData)
            let enterL = links.enter()
            let exitL = links.exit()
            enterL.insert('path', '.node')
                .attr('class', 'link')
                .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
            links.transition().duration(0).attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
            // exitL.transition().duration(500).attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x)).remove()
            exitL.remove()
        }
        // let links = tree(treeData).links()

        // console.log(links)
    }
}

export default Simple003