import React, {Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
class Simple006 extends Component {
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
        const margin = { top: 80, right: 0, bottom: 80, left: 0 };
        const width = containerWidth - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        let chart = d3.select(this.chartRef).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);// 设置总宽高

        const radius = Math.min(width, height) / 2;

        let g = chart.append("g").attr("transform", "translate(" + (width / 2 + margin.left) + "," + (margin.top + radius) + ")"); // 设最外包层在总图上的相对位置

        let colors = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        let arc = d3.arc() // 定义单个圆弧
            .innerRadius(0)
            .padAngle(0);

        let startPointArc = d3.arc() // 定义单个圆弧里面的线条开始点所在的弧
            .outerRadius(radius - 10)
            .innerRadius(radius - 10);

        let percentLabelArc = d3.arc() // 定义单个圆弧里面的percent文字
            .outerRadius(radius - 60)
            .innerRadius(radius - 60);

        let populationLabelArc = d3.arc() // 定义单个圆弧里面的population文字
            .outerRadius(radius + 40)
            .innerRadius(radius + 40);

        let pie = d3.pie() // 定义饼图
            .sort(null)
            .value(function (d) { return d.population; });

        const data = this.props.data;

        const sumData = d3.sum(data, d => d.population);
        colors.domain(d3.map(data, d => d.age).keys()); // 定义颜色值域

        g.selectAll(".arc") // 画环图
            .data(pie(data))
            .enter().append("path")    
            .attr("cursor", "pointer")
            .attr("class", "arc")
            .attr('stroke', function (d) { return colors(d.data.age); })
            .style("fill", function (d) { return colors(d.data.age); })
            .each(function(d) { // 储存当前起始与终点的角度、并设为相等
                let tem = {...d, endAngle: d.startAngle};
                d.outerRadius = radius - 10;
                this._currentData = tem; 
            })
            .on("mouseover", arcTween(radius + 20, 0))
    　　　　.on("mouseout", arcTween(radius - 10, 150))
            .transition()
            .duration(100)
            .delay(function (d, i) { return i * 100; })
            .attrTween("d", function(next) { // 动态设置d属性、生成动画
              var i = d3.interpolate(this._currentData, next);
              this._currentData = i(0);　// 重设当前角度
              return function(t) {
                return arc(i(t));
              };
            });


        const arcs = pie(data); // 构造圆弧

        let linkLine = g.append("g"); // 创建每条连接线
        let links = [];
        arcs.forEach(function (d) { // 输出age文字
            const startPoint = startPointArc.centroid(d);
            const endPoint = populationLabelArc.centroid(d);
            links.push({
                source: [startPoint[0], startPoint[1]],
                target: [endPoint[0], endPoint[1]]
            });
        });

        linkLine.selectAll()
        .data(links)
        .enter()
        .append("path")
                .attr("class", "link-line")
                .style("stroke", "#999")
                .style("stroke-width", 1)
                .attr('fill', 'none')
                .attr("d", d3.linkHorizontal().source(function(d){ return d.source; }).target(function(d){ return d.target; }));        
 
        let label = g.append("g");       

        arcs.forEach(function (d) { // 输出percent文字
            const c = percentLabelArc.centroid(d);
            label.append("text")
                 .attr("class", "age-text")
                 .attr('fill', '#cddc39')
                 .attr('font-weight', '700')
                 .attr('font-size', '14px')
                 .attr('text-anchor', 'middle')
                 .attr('x', c[0])
                 .attr('y', c[1])
                 .text((d.data.population * 100 / sumData).toFixed(1) + '%');
        });

        arcs.forEach(function (d) { // 输出population文字
            var c = populationLabelArc.centroid(d);
            label.append("text")
                 .attr("class", "age-text")
                 .attr('fill', '#000')
                 .attr('font-size', '12px')
                 .attr('text-anchor', function(d){
                    return c[0] >= 0 ? 'start' : 'end'; 
                 })
                 .attr('x', c[0])
                 .attr('y', c[1])
                 .text(d.data.age + '岁 : ' + (d.data.population / 10000).toFixed(2) + '万人');
        });

        chart.append('g')// 输出标题
            .attr('class', 'arc--title')
            .append('text')
            .attr('fill', '#fff')
            .attr('font-size', '14px')
            .attr('font-weight', '700')
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (margin.top + radius) + ")")
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', 0)
            .text('XX市人口年龄结构');     

        function arcTween(outerRadius, delay) { // 设置缓动函数
          return function() {
            d3.select(this).transition().delay(delay).attrTween("d", function(d) {
              var i = d3.interpolate(d.outerRadius, outerRadius);
              return function(t) { d.outerRadius = i(t); return arc(d); };
            });
          };
        }
    }
}
Simple006.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        age:PropTypes.string.isRequired,
        population:PropTypes.number.isRequired
    }).isRequired).isRequired,
}
Simple006.defaultProps = {data:[
    { age: '<5', population: 2704659 },
    { age: '5-13', population: 4499890 },
    { age: '14-17', population: 2159981 },
    { age: '18-24', population: 3853788 },
    { age: '25-44', population: 14106543 },
    { age: '45-64', population: 8819342 },
    { age: '≥65', population: 612463 }
]}
export default Simple006