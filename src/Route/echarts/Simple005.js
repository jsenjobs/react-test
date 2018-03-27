import React, {Component} from 'react'

import ReactEcharts from 'echarts-for-react'

import option from './utils/Simple005'

class Simple005 extends Component {
    render() {
        return (<ReactEcharts option={option} />)
    }
}


export default Simple005