import React, {Component} from 'react'
// import * as d3 from 'd3'
import './style001.css'
var d3 = require('d3')
// d3.box = require('d3-box')
// d3.scale = require('d3-scale')

class Simple001 extends Component {
    render() {
        return (<div style={{'width': '100%', 'height': '800px', 'backgroundColor': '#DAE4E4'}} >
        <svg width="960" height="200" />
        </div>)
    }

    componentDidMount() {
        this.rensderD3()
    }

    rensderD3 = () => {
        // create data
        var randomX = d3.randomUniform(0, 10),
            randomY = d3.randomNormal(0.5, 0.12),
            data = d3.range(800).map(function() { return [randomX(), randomY()]; });

        var svg = d3.select("svg"),
            margin = {top: 0, right: 50, bottom: 50, left: 50},
            width = (+svg.attr("width") - margin.left - margin.right),
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .domain([0, 10])
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([0, height]);

        var brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("start brush", brushed);

        var dot = g.append("g")
            .attr("fill-opacity", 0.2)
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("transform", function(d) { return "translate(" + x(d[0]) + "," + y(d[1]) + ")"; })
            .attr("r", 3.5);

        g.append("g")
            .call(brush)
            .call(brush.move, [1,2].map(x))
            .selectAll(".overlay")
            .on("mousedown touchstart", beforebrushed, true);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        function beforebrushed() {
            d3.event.stopImmediatePropagation();
            d3.select(this.parentNode).transition().call(brush.move, x.range());
        }

        function brushed() {
            var extent = d3.event.selection.map(x.invert, x);
            dot.classed("selected", function(d) { return extent[0] <= d[0] && d[0] <= extent[1]; });
        }
    }
}

export default Simple001