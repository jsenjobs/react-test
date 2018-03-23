import React, {Component} from 'react'
import {Row, Col} from 'antd'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import data from './data/Edata'

import EChartsWithHttp from './EchartsHttpData'

class PageEcharts extends Component {

    componentDidMount() {
        
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
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
        echarts.init(document.getElementById('main1')).setOption(data.charts1)
    }

    render() {
        return (<div>
            <EChartsWithHttp />
            <Row>
            <Col span={12}><div id="main" style={{height: 400 }} /></Col>
            <Col span={12}><div id="main1" style={{height: 400 }} /></Col>
            </Row>
            </div>)
    }
}

export default PageEcharts