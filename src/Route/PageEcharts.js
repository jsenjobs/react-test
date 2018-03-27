import React, {Component} from 'react'
import {Row, Col} from 'antd'
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import EChartsWithHttp from './echarts/EchartsHttpData'
import Simple001 from './echarts/Simple001'
import Simple002 from './echarts/Simple002'
import Simple003 from './echarts/Simple003'
import Simple004 from './echarts/Simple004'
import Simple005 from './echarts/Simple005'
import Simple006 from './echarts/Simple006'
import Simple0011 from './d3/Simple001'
// import Simple007 from './echarts/Simple007'

class PageEcharts extends Component {

    componentDidMount() {
    }

    render() {
        return (<div>
            <Row>
            <Col span={12}><Simple001/></Col>
            <Col span={12}><Simple002 /></Col>
            </Row>
            <Row>
            <Col span={12}><Simple003/></Col>
            <Col span={12}><Simple004 /></Col>
            </Row>
            <Row>
            <Col span={12}><Simple005 /></Col>
            <Col span={12}><Simple006 /></Col>
            </Row>
            <Row>
            <Col span={12}><Simple0011 /></Col>
            <Col span={12}><EChartsWithHttp /></Col>
            </Row>
            </div>)
    }
}

export default PageEcharts