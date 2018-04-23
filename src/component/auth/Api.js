import React, {Component} from 'react'
import Apis from '../../Api/Apis'
import {Table, Button, message, Modal, Input, Card} from 'antd'
import {AFetch} from '../../utils/AFetch'

class Api extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            modalVisiable:false
        }

        this.columns = [
            {
                title:'ID', dataIndex:'id',key:'id',
                render: text => (<div>{text}</div>)
            },
            {
                title:'Url', dataIndex:'url',key:'url',
                render: text => (<a href=''>{text}</a>)
            },
            {
                title:'Filters', dataIndex:'filters',key:'filters',
                render: text => (<div>{text}</div>)
            },
            {
                title:'Sort', dataIndex:'sort',key:'sort',
                render: text => (<div>{text}</div>)
            },
            {
                title:'操作', dataIndex:'', key:'x',render: (text, record, index) => (<Button type='primary' onClick={this.doDelete.bind(this, index, record.url)}>Delete</Button>)
            }
        ]
    }
    render() {
        return (
        <div style={{overflow:'auto'}}>
            <Card>
                <Button type='primary' icon='plus' onClick={this.showModal}>修改api权限</Button>
                <Modal title='修改api权限'
                visible={this.state.modalVisiable}
                onOk={this.addFilter}
                onCancel={this.hiddenModal}
                >
                <Input ref={input => this.domUrl = input} type='text' placeholder='url[/shiro/**]' />
                <Input ref={input => this.domFilters = input} type='text' placeholder='filters[jwt,roles[admin]]' />
                <Input ref={input => this.domSort = input} type='text' placeholder='sort[1]' />
                </Modal>
            </Card>
            <Table size='small' dataSource={this.state.data} columns={this.columns}/>
            </div>)
    }

    showModal = () => {
        this.setState({
            modalVisiable: true
        })
    }
    hiddenModal = () => {
        this.setState({
            modalVisiable: false
        })
    }
    addFilter = () => {
        this.setState({
            modalVisiable: false
        })
        let url = this.domUrl.input.value
        let filters = this.domFilters.input.value
        let sort = this.domSort.input.value

        AFetch(Apis.filter.create + '?url=' + url + '&filters=' + filters + '&sort=' + sort).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let d = json.data
                data.splice(0, 0, {id:d.id, url:d.url, filters:d.filters, sort:d.sort})
                this.setState({data:data})
                message.info('创建成功')
            } else {
                message.error('创建失败:' + json.msg)
            }
        })

    }

    componentDidMount() {
        this.fetchData()
    }
    fetchData = () => {
        AFetch(Apis.filter.listAll).then(res => res.json()).then(json => {
            if(json.code === 0) {

                let data = json.data.map(d => {
                    return {
                        id:d.id,url:d.url,filters:d.filters,sort:d.sort
                    }
                })
                this.setState({data:data})
            }
        })
    }

    doDelete = (index, url) => {
        AFetch(Apis.filter.delete + '?url=' + encodeURIComponent(url)).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                data.splice(index, 1)
                this.setState({data:data})
                message.info('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
}

export default Api