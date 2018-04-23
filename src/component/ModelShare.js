import React, {Component} from 'react'
import {Card, Row, Col, Popover, message, Icon, Popconfirm} from 'antd'
import './ModelShare.css'
import {AFetchJSON} from '../utils/AFetch'
import Apis from '../Api/Apis'

function Cards(props) {
    let {data, fetcher} = props


    let i = 0
    let pc = 'bottom'
    let n = data.map(d => {
        if(i++ <= 4) {
            pc = 'bottom'
        } else {
            pc = 'top'
        }
        return <Col key={d.id} style={{marginBottom:'20px'}} span={4}>
                <Card title={<div style={{display:'flex'}}><div style={{flex:1}}>{d.name}</div>
                <Popconfirm title="确定要删除该分享模型?" onConfirm={_ => {
                    AFetchJSON(Apis.model.deleteShareModel + d.id).then(json => {
                        if(json.code === 0) {
                            message.success('删除成功')
                            fetcher()
                        } else {
                            message.warn('删除失败')
                        }
                    })
                }} okText="确定" cancelText="取消">
                <Icon style={{cursor:'pointer', marginRight: 4, height:'24px', lineHeight:'24px'}} type="close" />
                </Popconfirm>
                </div>} className=''>
                <Popover title='介绍' placement={pc} content={<div style={{ width: 300}}>{d.intro}</div>}>
                    <div style={{ height:'100%', height:'100%', overflow:'hidden' }}>{d.intro}</div>
                </Popover>
                </Card>
            </Col>
    })
    let need = 5 - n.length % 5
    for(let i = 0; i < need; i++) {
        n.push(<Col style={{marginBottom:'20px'}} span={4}></Col>)
    }
    let group = []
    for(let j = 0; j < n.length; j+=5) {
        if(j + 4 < n.length) {
            group.push(<Row  type="flex" justify="space-around" align="middle" gutter={16}>{n[j]}{n[j+1]}{n[j+2]}{n[j+3]}{n[j+4]}</Row>)
        }
    }

    return <div>{group}</div>
}

class ModelShare extends Component {

    state = {
        shareModelList: []
    }

    componentWillReceiveProps(newProps) {
        this.fetchData()
    }
    componentDidMount() {
        this.fetchData()
    }
    fetchData = () => {
        AFetchJSON(Apis.model.listShareModels).then(json => {
            if(json.code === 0) {
                this.setState({shareModelList: json.data})
            } else {
                message.warn('获取分享模型数据出错')
            }
        })
    }
    render() {
        return (<div id='model-share-container'>
            <Cards fetcher={this.fetchData} data={this.state.shareModelList} />
      </div>)
    }
}

export default ModelShare