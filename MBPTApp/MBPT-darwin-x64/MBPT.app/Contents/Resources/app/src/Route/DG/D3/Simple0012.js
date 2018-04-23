import React, {Component } from 'react'
import * as d3 from 'd3'
import 'whatwg-fetch'
class Simple0012 extends Component {
    constructor(props) {
        super(props)
        this.state = {data:null}
    }
    componentDidMount() {

        (async () => {
            try {
                const res = await fetch('http://oiu3g8jom.bkt.clouddn.com/json/china.geojson');
                const data = await res.json();
                this.setState({data:data});
                this.renderD3()
            } catch (err) {
                console.log(err);
            }
        })()
    }
    render() {
        return (<div className="bar-chart--simple">
                <svg ref={(r) => this.chartRef = r}></svg>
        </div>)
    }

    renderD3 = () => {
        const containerWidth = this.chartRef.parentElement.offsetWidth;
        const data = this.state.data;
        const margin = { top: 80, right: 20, bottom: 30, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = 1000 - margin.top - margin.bottom;     
        let chart = d3.select(this.chartRef).attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);  

        let projection = d3.geoMercator() // 定义墨卡托地理投射(平面投射)
                        .center([107, 31]) // 此经纬度显示在center
                        .scale(d3.min([width, height]))
                        .translate([width/2, height/2]);

        let path = d3.geoPath() // 定义路径
            .projection(projection);

        let z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])// 通用线条的颜色  

        let g = chart.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")") // 设最外包层在总图上的相对位置
        .style('fill-opacity', 0);     

        let province = g.selectAll("path") // 绘画所有的省
            .data(data.features)
            .enter()
            .append("path")
            .attr("stroke","grey")
            .attr("stroke-width",1)
            .attr("fill", function(d, i) {
                return z(i);
            })
            .attr("d", path)
            .on("mouseover", function(d, i) {
                d3.select(this)
                    .attr("fill","yellow");
            })
            .on("mouseout", function(d, i) {
                d3.select(this)
                    .attr("fill",z(i));
            });  

        province.append("title") // 输出Title，mouseover显示
          .text(d => d.properties.name); 

        g.transition()
        .duration(1000)
        .style('fill-opacity', 1); // 动画渐现  

        chart.append('g')// 输出标题
            .attr('class', 'bar--title')
            .append('text')
            .attr('fill', '#000')
            .attr('font-size', '16px')
            .attr('font-weight', '700')
            .attr('text-anchor', 'middle')
            .attr('x', containerWidth / 2)
            .attr('y', 20)
            .text('中国地图');
    }
}

export default Simple0012