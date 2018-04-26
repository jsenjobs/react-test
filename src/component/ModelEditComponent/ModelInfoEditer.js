import React, {Component} from 'react'
import { Table, Icon, Row, Col } from 'antd'

import EditableText from '../public/EditableText'

function genFlow(type, _workConf) {
    let result = []
    if(type === 'ModeAggregation') {
        let keys = _workConf.keys
        let names = _workConf.names
        let funcs = _workConf.funcs
        let columns = _workConf.columns

        keys.every(i => {
            result.push(<Col span='12'>{names[i]}列： {funcs[i]}{' ( ' + columns[i] + ' )'}</Col>)
        })
    } else {
        result.push(<Col span='24'>此类型未实现描述</Col>)
    }
    return result
}

class App extends Component {
    render() {
        const {conf, changeName} = this.props
        if(!conf) return <div style={{paddingLeft:12}}>没有选中的模型</div>

        if(conf.type === 'DataSource') {
            const {_workConf} = conf
            return <div className='model-edit' style={{paddingLeft:12}}>
                <Row>
                    <Col span='8'>模型类型：{conf.type}</Col>
                    <Col span='16'><EditableText onChange={changeName} preText='模型名字：' defaultValue={conf.text} /></Col>
                    <Col span='8'>数据表名：{_workConf.tableName}</Col>
                    <Col span='16'>数据表中文名字：{_workConf.metaName}</Col>
                </Row>
            </div>
        } else if(conf.type === 'Calc') {
            const {_workConf} = conf
            return <div className='model-edit' style={{paddingLeft:12}}>
                <Row>
                    <Col span='12'>模型类型：{conf.type}</Col>
                    <Col span='12'><EditableText onChange={changeName} preText='模型名字：' defaultValue={conf.text} /></Col>
                    <Col span='12'>运算类型：{_workConf.type}</Col>
                    <Col span='24'>
                    模型详情：
                    </Col>
                    {genFlow(_workConf.type, _workConf)}
                </Row>
            </div>
        } else {
            return <div style={{paddingLeft:12}}>
            模型类型：{conf.type}
            </div>

        }
    }
}

export default App