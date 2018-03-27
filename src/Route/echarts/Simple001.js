import React, {Component } from 'react'


// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

class Simple001 extends Component {

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('simple001'));
        // 绘制图表
        myChart.setOption({
            title: { text: 'ECharts图表' },
            tooltip: {},
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    }
    render() {
        return (<div style={{height: 400 }}  id='simple001' />)
    }
}

export default Simple001