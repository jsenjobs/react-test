import React, {Component} from 'react'
// import * as d3 from 'd3'
import './style002.css'

import graph from './miserables.json'
var d3 = require('d3')
// d3.box = require('d3-box')
// d3.scale = require('d3-scale')

class Simple002 extends Component {
    render() {
        return (<div style={{'width': '100%', 'height': '800px', 'backgroundColor': '#DAE4E4'}} >
        <svg width="960" height="800" />
        </div>)
    }

    componentDidMount() {
        this.rensderD3()
    }

    rensderD3 = () => {
        var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 2.5)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.rx;
            d.fy = d.ry;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
}

export default Simple002