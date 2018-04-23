import React, {Component } from 'react'


// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
require('echarts-liquidfill')

class Simple001 extends Component {

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('simple008'));
        // 绘制图表
        myChart.setOption({
            series: [{
                type: 'liquidFill',
                data: [0.6],
                color: ['#1cF056'],
                itemStyle: {
                        opacity: 0.6
                },
                emphasis: {
                    itemStyle: {
                        opacity: 0.9
                    }
                },
                backgroundStyle: {
                    borderColor: '#156ACF',
                    borderWidth: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    shadowBlur: 20
                },
                outline: {
                    show: false
                },
                shape: 'diamond'
            }]
        });
    }
    render() {
        return (<div style={{height: 400 }}  id='simple008' />)
    }
}

export default Simple001