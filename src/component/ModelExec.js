// 共享模型执行页面

import React, {Component} from 'react'
import {Card, Row, Col, Popover, message, Icon, Popconfirm, Table, Input} from 'antd'
import './ModelShare.less'
import {AFetchJSON} from '../utils/AFetch'
import Apis from '../Api/Apis'
import { Button } from 'antd/lib/radio';


const funcMap = {
    eq: '=',
    gt: '>',
    lt: '<',
    gteq: '>=',
    lteq: '<=',
    noteq: '<>',
}
function DyItems(props) {
    const {tableName, params, onChange} = props
    const node = params.map((param, index) => {
        let func = funcMap[param.func]
        if(!func) func = param.func
        return <Col span='12' key={index}>
            <Row>
                <Col span='7'><div>{param.dynamicName}</div></Col>
                <Col span='5'><div>{func}</div></Col>
                <Col span='9'><Input size='small' value={param.value} placeholder='输入值' onChange={e => onChange(tableName, index, e)} /></Col>
            </Row>
        </Col>
    })
    return <div>
        {tableName}:
        <Row>
        {node}
        </Row>

    </div>
}

class App extends Component {
    state = {
        httpStat:0,
        data:[],
        dynamicParams:{},
    }

    createParam = () => {
        let result = {}
        let p = this.state.dynamicParams
        for(let key in p) {
            let params = p[key]
            params.forEach(item => {
                result[item.dynamicName] = item.value
            })
        }
        return result
    }
    exec = () => {
        let id = this.props.match.params.id
        let p = this.createParam()
        console.log(p)
        AFetchJSON(Apis.model.execShare + id + '?dynamicParams=' + encodeURIComponent(JSON.stringify(p))).then(json => {
            if(json.code === 0) {
                let ps = json.dynamicParams
                let {dynamicParams} = this.state
                for(let key in ps) {
                    if(!dynamicParams[key]) {
                        dynamicParams[key] = ps[key]
                    }
                }
                this.setState({httpStat:2, data: json.data, dynamicParams})
            } else {
                this.setState({httpStat:1})
            }
        })
    }
    componentDidMount() {
        this.exec()
    }
    render() {
        const {httpStat, data, dynamicParams} = this.state
        if(httpStat === 0) {
            return <div>正在获取数据</div>
        } else if(httpStat === 1) {
            return <div>获取数据失败</div>
        } else {
            if(data.length === 0) {
                return <div>没有数据可显示</div>
            }
            let firstItem = data[0]
            let columns = []
            for(let key in firstItem) {
                columns.push({
                    title: key,
                    dataIndex: key,
                    key: key,
                })
            }
            let params = []
            for(let key in dynamicParams) {
                params.push(<DyItems tableName={key} params={dynamicParams[key]} onChange={this.onParamValueChnage} />)
            }
            return <div className='model-share-exec'>
                 <Card title={<div style={{display:'flex',alignItems:'center'}}>动态参数设置<div style={{flex:1}} /><Button size='small' style={{float: 'right'}} onClick={this.exec}>执行</Button></div>} style={{ width: '100%' }}>
                    {params}
                </Card>
                <Table size='small' columns={columns} dataSource={data} /></div>
        }
    }



    onParamValueChnage = (key, index, e) => {
        const {dynamicParams} = this.state
        dynamicParams[key][index].value = e.target.value
        this.setState({dynamicParams})
    }
}


export default App