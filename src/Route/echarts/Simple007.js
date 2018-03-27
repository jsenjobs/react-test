

import React, {Component} from 'react'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

import init from './utils/Simple007'

class Simple007 extends Component {
    componentDidMount() {
        init()
    }
    render() {
        return (<div style={{height: 400 }}  id='simple007' />)
    }
}


export default Simple007


