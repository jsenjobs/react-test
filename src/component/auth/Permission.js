import React, {Component} from 'react'
import Apis from '../../Api/Apis'
import {Table, Button, message, Modal, Input, Card} from 'antd'
import {AFetch} from '../../utils/AFetch'




const TypeMap = {
    0:'系统权限、UI权限、不可删除',
    0:'系统权限、UI权限、不可删除',
}
class Permission extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pagination:{pageSize:20, current:1},
            modalVisiable:false
        }

        this.columns = [
            {
                title:'ID', dataIndex:'id',key:'id',
                render: text => (<div>{text}</div>)
            },
            {
                title:'权限标识', dataIndex:'permission',key:'permission',
                render: text => (<a href=''>{text}</a>)
            },
            {
                title:'注释', dataIndex:'comment',key:'comment',
            },
            {
                title:'类型', dataIndex:'type',key:'type',
                render: text => (<div>{text === 0 ? '系统权限、UI权限、不可删除':text === 1 ? '系统权限、操作权限、不可删除' : '自定义权限'}</div>)
            },
            {
                title:'操作', dataIndex:'', key:'x',render: (text, record, index) => (<Button type='primary' disabled={record.type === 0 || record.type === 1} onClick={this.doDelete.bind(this, index, record.permission)}>删除</Button>)
            }
        ]
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        return (<div style={{overflow:'auto'}}>
            <Card bordered={false}>
                <Button type='primary' icon='plus' onClick={this.showAddUserModal}>添加权限</Button>
                <Modal title='添加权限'
                visible={this.state.modalVisiable}
                onOk={this.addUser}
                onCancel={this.hiddenAddUserModal}
                >
                <Input ref={input => this.domInput = input} type='text' placeholder='perms[userinfo:edit]' />
                </Modal>
            </Card>
            <Table size='small' dataSource={this.state.data} columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange}/>
        </div>)
    }

    fetchData = (pager = this.state.pagination) => {
        AFetch(Apis.auth.listPermission + pager.current + '/' + pager.pageSize).then(res => res.json()).then(json => {
            if(json.code === 0) {
                /*
                let data = json.data.map(d => {
                    return {
                        id:d.id,permission:d.permission
                    }
                })*/
                const pager = {...this.state.pagination}
                pager.total = json.total
                this.setState({data:json.data, pagination:pager})
            }
        })

    }

    handleTableChange = (pagination, filters, storter) => {
        const pager = {...this.state.pagination}
        pager.current = pagination.current
        this.setState({pagination:pager})
        this.fetchData(pager)
    }

    doDelete = (index, name) => {
        AFetch(Apis.auth.deletePermission + name).then(res => res.json()).then(json => {
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

    showAddUserModal = () => {
        this.setState({
            modalVisiable: true
        })
    }
    hiddenAddUserModal = () => {
        this.setState({
            modalVisiable: false
        })
    }
    addUser = () => {
        this.setState({
            modalVisiable: false
        })
        // show
        this.doAddUser(this.domInput.input.value)
    }
    doAddUser = (name) => {
        AFetch(Apis.auth.createPermission + name).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let d = json.data
                data.splice(0, 0, {id:d.id, permission:d.permission})
                this.setState({data:data})
                message.info('创建权限成功')
            } else {
                message.error('创建权限失败:' + json.msg)
            }
        })
    }
}

export default Permission