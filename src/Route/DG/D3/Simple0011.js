import React, {Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
class Simple0011 extends Component {
    componentDidMount() {
        setTimeout(_ => {
            this.renderD3()
        }, 50)
    }
    render() {
        return (<div className="bar-chart--simple">
                <svg ref={(r) => this.chartRef = r}></svg>
        </div>)
    }

    renderD3 = () => {
        const containerWidth = this.chartRef.parentElement.offsetWidth;
        const data = this.props.data;
        const margin = { top: 60, right: 60, bottom: 60, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = 700 - margin.top - margin.bottom; 
        let chart = d3.select(this.chartRef)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        let g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // 设最外包层在总图上的相对位置
        let simulation = d3.forceSimulation() // 构建力导向图
                    .force('link',d3.forceLink().id((d, i) => d.id).distance(d => 50 * d.value))
                    .force("charge", d3.forceManyBody())
                    .force("center", d3.forceCenter(width / 2, height / 2));

        let z = d3.scaleOrdinal(d3.schemeCategory10);// 通用线条的颜色 

        let link = g.append("g") // 画连接线
          .attr("class", "links")
        .selectAll("line")
        .data(data.edges)
        .enter().append("line");

        let linkText = g.append("g") // 画连接连上面的关系文字
          .attr("class", "link-text")
        .selectAll("text")
        .data(data.edges)
        .enter().append("text")
        .text(function(d){
            return d.relation;
        });        

        let node = g.append("g") // 画圆圈和文字
          .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter().append("g")
        .on("mouseover",function(d,i){
            //显示连接线上的文字
            linkText.style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 1;
                }
            });
            //连接线加粗
            link.style('stroke-width', function(edge){
                if( edge.source === d || edge.target === d ){
                    return '2px';
                }
            }).style('stroke', function(edge){
                if( edge.source === d || edge.target === d ){
                    return '#485';
                }
            });
        })
        .on("mouseout",function(d,i){
            //隐去连接线上的文字
            linkText.style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 0;
                }
            });
            //连接线减粗
            link.style('stroke-width', function(edge){
                if( edge.source === d || edge.target === d ){
                    return '1px';
                }
            }).style('stroke', function(edge){
                if( edge.source === d || edge.target === d ){
                    return '#ddd';
                }
            });
        })
        .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))

        node.append('circle')
          .attr("r", 5)
          .attr('fill',function(d, i){return z(i);});

        node.append("text")
            .attr('fill',function(d, i){return z(i);})
            .attr("y", -20)
            .attr("dy", ".71em")           
            .text(function(d) { return d.name; });

        simulation // 初始化力导向图
          .nodes(data.nodes)
          .on("tick", ticked);

        simulation.force("link")
          .links(data.edges);

        chart.append('g')// 输出标题
            .attr('class', 'bar--title')
            .append('text')
            .attr('fill', '#000')
            .attr('font-size', '16px')
            .attr('font-weight', '700')
            .attr('text-anchor', 'middle')
            .attr('x', containerWidth / 2)
            .attr('y', 20)
            .text('人物关系图');             

        function ticked() { // 力导向图变化函数，让力学图不断更新
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            linkText
                .attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
                .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
            node
                // .attr("cx", function(d) { return d.x; })
                // .attr("cy", function(d) { return d.y; })
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        }

        function dragstarted(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3).restart()
            }
            d.fx = d.x;
            d.fy = d.y;
        } 

        function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        }

        function dragended(d) {
            if (!d3.event.active) {
                // simulation.alphaTarget(0)
                simulation.stop()
            }
            d.fx = null;
            d.fy = null;
        }
    }
}
Simple0011.propTypes = {
    data: PropTypes.shape({
        nodes: PropTypes.arrayOf(PropTypes.shape({
            name:PropTypes.string.isRequired,
        // href:PropTypes.string.isRequired,
        }).isRequired).isRequired,
        edges: PropTypes.arrayOf(PropTypes.shape({
            source:PropTypes.number.isRequired,
            target:PropTypes.number.isRequired,
            relation:PropTypes.string.isRequired,
        }).isRequired).isRequired,
    }).isRequired
}
Simple0011.defaultProps = {data:{
    nodes: [
        {name: 'A人物', id:0},
        {name: 'B人物', id:1},
        {name: 'C人物', id:2},
        {name: 'D人物', id:3},
        {name: 'E人物', id:4},
        {name: 'F人物', id:5},
        {name: 'G人物', id:6},
        {name: 'H人物', id:7},
        {name: 'I人物', id:8},
        {name: 'J人物', id:9},
        {name: 'K人物', id:10},
        {name: 'L人物', id:11},
        {name: 'M人物', id:12},
    ],
    edges: [ // value越小关系越近
        { "source": 0 , "target": 1 , "relation":"朋友", value: 3 },
        { "source": 0 , "target": 2 , "relation":"朋友", value: 3 },
        { "source": 0 , "target": 3 , "relation":"朋友", value: 6 },
        { "source": 1 , "target": 2 , "relation":"朋友", value: 6 },
        { "source": 1 , "target": 3 , "relation":"朋友", value: 7 },
        { "source": 2 , "target": 3 , "relation":"朋友", value: 7 },
        { "source": 0 , "target": 4 , "relation":"朋友", value: 3 },
        { "source": 0 , "target": 5 , "relation":"朋友", value: 3 },
        { "source": 4 , "target": 5 , "relation":"夫妻", value: 1 },
        { "source": 0 , "target": 6 , "relation":"兄弟", value: 2 },
        { "source": 4 , "target": 6 , "relation":"同学", value: 3 },
        { "source": 5 , "target": 6 , "relation":"同学", value: 3 },
        { "source": 4 , "target": 7 , "relation":"同学", value: 4 },
        { "source": 5 , "target": 7 , "relation":"同学", value: 3 },
        { "source": 6 , "target": 7 , "relation":"同学", value: 3 },
        { "source": 4 , "target": 8 , "relation":"师生", value: 4 },
        { "source": 5 , "target": 8 , "relation":"师生", value: 5 },
        { "source": 6 , "target": 8 , "relation":"师生", value: 3 },
        { "source": 7 , "target": 8 , "relation":"师生", value: 5 },
        { "source": 8 , "target": 9 , "relation":"师生", value: 4 },
        { "source": 3 , "target": 9 , "relation":"师生", value: 5 },
        { "source": 2 , "target": 10 , "relation":"母子", value: 1 },
        { "source": 10 , "target": 11 , "relation":"雇佣", value: 6 },
        { "source": 10 , "target": 12 , "relation":"雇佣", value: 6 },
        { "source": 11 , "target": 12 , "relation":"同事", value: 7 }             
    ],
}}
export default Simple0011