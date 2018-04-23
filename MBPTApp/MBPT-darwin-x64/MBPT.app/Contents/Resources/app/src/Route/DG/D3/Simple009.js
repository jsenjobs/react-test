import React, {Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
class Simple009 extends Component {
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
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = containerWidth - margin.left - margin.right;
        const height = 1500 - margin.top - margin.bottom;  

        let chart = d3.select(this.chartRef).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);        

        let g = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // 设最外包层在总图上的相对位置
        
        let z = d3.scaleOrdinal(d3.schemeCategory10);// 通用线条的颜色

        let root = d3.hierarchy(data) //数据分层
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value; });

        let pack = d3.pack() // 构建打包图
            .size([width - 2, height - 2])
            .padding(3);

        pack(root);
 
        let node = g.selectAll("g") // 定位到所有圆的中点，画g
        .data(root.descendants())
        .enter().append("g")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"); })
          .style("cursor", "pointer")
          .style("fill-opacity", "0.8")
          .each(function(d) { d.node = this; })
          .on("mouseover", hovered(true))
          .on("mouseout", hovered(false));

        node.append("circle") // 画圈圈
              .attr("id", function(d) { 
                return 'r' + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y);  // 用r+x+y生成唯一id，原创思路
              })
              .style("fill", function(d) { return z(d.depth); }) 
              .attr("r", 0)            
              .transition()
              .duration(50)
              .delay(function (d, i) { return i * 50; })  
              .attr("r", function(d) { return d.r; });

        let leaf = node.filter(function(d) { return !d.children; }); // 筛选出叶子节点

        leaf.append("clipPath") // 增加遮罩防止文字超出圆圈
          .attr("id", function(d) { return 'clip-r' + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y); })
        .append("use") // 大小引用圈圈的大小
          .attr("xlink:href", function(d) { return '#r' + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y); });

        leaf.append("text") // 输出叶子文字
          .attr("clip-path", function(d) { return "url(#clip-r" + Math.floor(d.r) + '-x' + Math.floor(d.x) + '-y' + Math.floor(d.y) + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.data.name; })
        .enter().append("tspan")
          .attr("x", 0)
          .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 12; })
          .text(function(d) { return d; });

        node.append("title") // 输出Title，mouseover显示
          .text(function(d) { return d.data.name + '\n' + d.value + '平方千米'; });

        let notLeaf = node.filter(function(d) { return d.depth === 1; }); // 筛选出四大一线城市节点

        notLeaf.append("text") // 输出四大一线城市的名字
        .selectAll("tspan")
        .data(function(d) { return d.data.name; })
        .enter().append("tspan")
          .style("fill", "#fff")
          .style("font-size","42px")
          .attr("x", 0)
          .attr("y", function(d, i, nodes) { return 70 + (i - nodes.length / 2 - 0.5) * 70; })
          .text(function(d) { return d; });        

        function hovered(hover) { // mouseover把所有老祖宗都圈线
          return function(d) {
            d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
          };
        }
    }
}
Simple009.propTypes = {
    data: PropTypes.shape({
      name:PropTypes.string.isRequired,
      children:PropTypes.array
    }).isRequired,
  }
Simple009.defaultProps = {data:{
    name: '中国一线城市',
    children: 
    [
        {
            name: '北京',
            children: [
                {
                    name: '东城区', 
                    value: 42
                },   
                {
                    name: '西城区', 
                    value: 51
                },
                {
                    name: '朝阳区', 
                    value: 471
                },   
                {
                    name: '丰台区', 
                    value: 304
                },
                {
                    name: '石景山区', 
                    value: 86
                },   
                {
                    name: '海淀区', 
                    value: 431
                },
                {
                    name: '顺义区', 
                    value: 1021
                },   
                {
                    name: '通州区', 
                    value: 906
                },
                {
                    name: '大兴区', 
                    value: 1036
                },   
                {
                    name: '房山区', 
                    value: 2019
                },
                {
                    name: '门头沟区', 
                    value: 1451
                },   
                {
                    name: '昌平区', 
                    value: 1344
                },
                {
                    name: '平谷区', 
                    value: 950
                },   
                {
                    name: '密云区', 
                    value: 2229
                },
                {
                    name: '怀柔区', 
                    value: 2123
                },   
                {
                    name: '延庆区', 
                    value: 1994
                },                                                           
            ]
        },
        {
            name: '上海',
            children: [
                {
                    name: '黄浦区', 
                    value: 20
                },   
                {
                    name: '徐汇区', 
                    value: 55
                },
                {
                    name: '长宁区', 
                    value: 38
                },   
                {
                    name: '静安区', 
                    value: 37
                },
                {
                    name: '普陀区', 
                    value: 56
                },   
                {
                    name: '虹口区', 
                    value: 23
                },
                {
                    name: '杨浦区', 
                    value: 61
                },   
                {
                    name: '浦东新区', 
                    value: 1210
                },
                {
                    name: '闵行区', 
                    value: 372
                },   
                {
                    name: '宝山区', 
                    value: 294
                },
                {
                    name: '嘉定区', 
                    value: 464
                },   
                {
                    name: '金山区', 
                    value: 611
                },
                {
                    name: '松江区', 
                    value: 605
                },   
                {
                    name: '青浦区', 
                    value: 676
                },
                {
                    name: '奉贤区', 
                    value: 687
                },   
                {
                    name: '崇明区', 
                    value: 1411
                },           
            ]
        },
        {
            name: '广州',
            children: [
                {
                    name: '越秀区', 
                    value: 34
                },   
                {
                    name: '荔湾区', 
                    value: 59
                },
                {
                    name: '海珠区', 
                    value: 90
                },   
                {
                    name: '天河区', 
                    value: 96
                },
                {
                    name: '白云区', 
                    value: 796
                },   
                {
                    name: '黄埔区', 
                    value: 484
                },
                {
                    name: '番禺区', 
                    value: 786
                },   
                {
                    name: '花都区', 
                    value: 970
                },
                {
                    name: '南沙区', 
                    value: 527
                },   
                {
                    name: '增城区', 
                    value: 1616
                },
                {
                    name: '从化区', 
                    value: 1974
                },                   
            ]
        },
        {
            name: '深圳',
            children: [
                {
                    name: '福田区', 
                    value: 79
                },   
                {
                    name: '罗湖区', 
                    value: 79
                },
                {
                    name: '南山区', 
                    value: 185
                },   
                {
                    name: '盐田区', 
                    value: 75
                },
                {
                    name: '宝安区', 
                    value: 398
                },   
                {
                    name: '龙岗区', 
                    value: 388
                },
                {
                    name: '龙华区', 
                    value: 176
                },   
                {
                    name: '坪山区', 
                    value: 167
                },
                {
                    name: '光明新区', 
                    value: 155
                },   
                {
                    name: '大鹏新区', 
                    value: 295
                },            
            ]
        }
    ]

}}
export default Simple009