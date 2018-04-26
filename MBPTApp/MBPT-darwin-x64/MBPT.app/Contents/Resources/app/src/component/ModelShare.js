import React, {Component} from 'react'
import {Card, Row, Col, Popover, message, Icon, Popconfirm} from 'antd'
import './ModelShare.less'
import {AFetchJSON} from '../utils/AFetch'
import Apis from '../Api/Apis'
import { withRouter} from 'react-router-dom';


function Cards(props) {
    let {data, fetcher, history} = props

    function great(mId) {
        AFetchJSON(Apis.great.great + mId).then(json => {
            message.info(json.msg)
            if(json.code === 0) {
                fetcher()
            }
        })
    }

    let num = 4
    let spanW = 5
    let i = 0
    let pc = 'bottom'
    let n = data.map(d => {
        if(i++ < num) {
            pc = 'bottom'
        } else {
            pc = 'top'
        }
        return <Col key={d.id} style={{marginBottom:'20px'}} span={spanW}>
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
                    <div onClick={_ => history.push(`/main/modeshare/exec/${d.id}`)} className='content'>
                        <div className='creator'>创建者：{d.creatorName}</div>
                        <div className='intro'><div>{d.intro}</div></div>
                        <Row onClick={e => e.stopPropagation()} className='funcs'>
                        <Col span='12'>
                        {d.isCollected ? <Icon onClick={_ => great(d.id)} type="heart" /> : <Icon onClick={_ => great(d.id)} type="heart-o" />} {d.collect}
                        </Col>
                        <Col span='12'>
                        <Icon type="eye" /> {d.look}
                        </Col>
                        </Row>
                    </div>
                </Popover>
                </Card>
            </Col>
    })
    let need = num - n.length % num
    for(let i = 0; i < need; i++) {
        n.push(<Col style={{marginBottom:'20px'}} span={spanW}></Col>)
    }
    let group = []
    for(let j = 0; j < n.length; j+=4) {
        group.push(<Row  type="flex" justify="space-around" align="middle" gutter={16}>{n[j]}{n[j+1]}{n[j+2]}{n[j+3]}</Row>)
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
                let greats = json.greats.map(item => item.mid)
                let data = json.data.map(item => {
                    return {...item, isCollected: greats.indexOf(item.id) != -1}
                })
                this.setState({shareModelList: data})
            } else {
                message.warn('获取分享模型数据出错')
            }
        })
    }
    render() {
        return (<div id='model-share-container'>
            <Cards fetcher={this.fetchData} data={this.state.shareModelList} history={this.props.history} />
      </div>)
    }
}

export default withRouter(ModelShare)