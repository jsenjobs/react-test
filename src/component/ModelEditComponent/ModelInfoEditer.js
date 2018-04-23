import React, {Component} from 'react'
import { Table, Icon, Row, Col } from 'antd'

import EditableText from '../public/EditableText'

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
        } else {
            return <div style={{paddingLeft:12}}>
            模型类型：{conf.type}
            </div>

        }
    }
}

export default App