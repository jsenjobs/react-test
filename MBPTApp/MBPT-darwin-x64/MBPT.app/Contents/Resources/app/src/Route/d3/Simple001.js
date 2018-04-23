import React, {Component } from 'react'
import * as d3 from 'd3'
import * as d3Tip from 'd3-tip'
import PropTypes from 'prop-types'
class Simple001 extends Component {
    componentDidMount() {
        this.renderD3()
    }
    render() {
        return (<div className="bar-chart--simple">
                <svg ref={(r) => this.chartRef = r}></svg>
        </div>)
    }

    renderD3 = () => {
        const containerWidth = this.chartRef.parentElement.offsetWidth
        const data = this.props.data
        const margin = {top: 80, right: 20, bottom: 30, left: 60}
        const width = containerWidth - margin.left - margin.right
        const height = 500 - margin.top - margin.bottom

        let chart = d3.select(this.chartRef)
        .attr('width', () => width + margin.left + margin.right)
        .attr('height', () => height + margin.top + margin.bottom)

        // set x y
        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1).domain(data.map(d => d.letter))
        let y = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(data, d => d.frequency)])

        // 每条柱宽度
        const barWidth = (width / data.length) * 0.9
        // 用于生成背景柱
        const maxFrequency = Math.floor(d3.max(data, d => d.frequency) * 100) + 1
         // 用于生成背景柱
        const stepMaxFrequency = Math.floor(maxFrequency / 10)
        // 用于生成背景柱
        const scaleMaxFrequency = Math.floor(maxFrequency / stepMaxFrequency)
        // 用于生成背景柱
        const colors = ['#ccc', '#ddd']

        let tip = d3Tip().attr('class', 'd3-tip').offset([-10, 0]).html(d => {
            return "<strong>星期" + d.letter + "<br>空置率:</strong> <span style='color:#ffeb3b'>" + (d.frequency * 100).toFixed(2) + "%</span>"
        })
        chart.call(tip)

        // 设最外包层在总图上的相对位置
        let g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        g.append("g") // 设置x轴
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

        g.append("g")// 设置y轴
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, '%'))
            .append("text")
            .attr("y", -16)
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .style("fill", "#000")
            .text("空置率 (%)")

        g.append("g")// 设置背景柱
            .attr("class", "bar--bg-bar")
            .selectAll('rect')
            .data(d3.range(scaleMaxFrequency))
            .enter()
            .append('rect')
            .attr('stroke', 'none')
            .attr('stroke-width', 0)
            .attr('fill', function (d, i) { return colors[i % 2]; })
            .attr('x', 1)
            .attr('width', width)
            .attr('height', Math.round(height * stepMaxFrequency / (y.domain()[1] * 100)))
            .attr('y', (d, i) =>  y((d + 1) * stepMaxFrequency / 100))

        g.selectAll(".bar")// 画柱图
            .data(data)
            .enter().append("rect")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr("class", "bar")
            .attr("fill", "#1a2be2")
            .attr("x", d => x(d.letter))
            .attr("y", height) // 控制动画由下而上
            .attr("width", x.bandwidth())
            .attr("height", 0) // 控制动画由下而上
            .transition()
            .duration(200)
            .ease(d3.easeBounceInOut)
            .delay((d, i) => i * 200)
            .attr("y", d => y(d.frequency))
            .attr("height", d => height - y(d.frequency))

        g.append('g')// 输出柱图上的数值
            .attr('class', 'bar--text')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('fill', 'white')
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) { return x(d.letter); })
            .attr('y', function (d) { return y(d.frequency); })
            .attr('dx', barWidth / 2)
            .attr('dy', '1em')
            .text(d =>(d.frequency * 100).toFixed(2) + '%')

        chart.append('g')// 输出标题
            .attr('class', 'bar--title')
            .append('text')
            .attr('fill', '#000')
            .attr('font-size', '16px')
            .attr('font-weight', '700')
            .attr('text-anchor', 'middle')
            .attr('x', containerWidth / 2)
            .attr('y', 20)
            .text('本周酒店房间空置率')

    }
}
Simple001.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        letter:PropTypes.string.isRequired,
        frequency:PropTypes.number.isRequired
    }).isRequired).isRequired,
}
Simple001.defaultProps = {data:[
    { letter: "一", frequency: 0.08167 },
    { letter: "二", frequency: 0.13492 },
    { letter: "三", frequency: 0.02782 },
    { letter: "四", frequency: 0.04253 },
    { letter: "五", frequency: 0.12702 },
    { letter: "六", frequency: 0.02288 },
    { letter: "日", frequency: 0.22288 }
]}
export default Simple001