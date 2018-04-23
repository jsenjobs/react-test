
import React, {Component } from 'react'


// 引入 highcharts 主模块
const Highcharts = require('highcharts')
require('highcharts/highcharts-3d')(Highcharts)
class App extends Component {

    componentDidMount() {
        Highcharts.chart('simple01', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 60
                }
            },
            title: {
                text: '简数科技每周水果消耗量'
            },
            subtitle: {
                text: 'Highcharts 中的3D环形图'
            },
            plotOptions: {
                pie: {
                    innerSize: 180,
                    depth: 45
                }
            },
            series: [{
                name: '货物金额',
                data: [
                    ['香蕉', 8],
                    ['猕猴桃', 3],
                    ['桃子', 1],
                    ['橘子', 6],
                    ['苹果', 8],
                    ['梨', 4],
                    ['柑橘', 4],
                    ['橙子', 1],
                    ['葡萄 (串)', 1]
                ]
            }]
        })
    }
    render() {
        return (<div style={{height: 400 }}  id='simple01' />)
    }
}

export default App