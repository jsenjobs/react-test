import React, {Component} from 'react'
import Apis from '../../Api/Apis'
import {Table, Button, message, Modal, Input, Card, Tag, Popconfirm, Select} from 'antd'
import {AFetch} from '../../utils/AFetch'

const ButtonGroup = Button.Group
const Option = Select.Option

function CreateOption(datas) {
    return datas.map(data => (<Option key={data.id} value={data.id}>{data.value}</Option>))
}

function OwnRoles(props) {
    function deleteRole(e) {
        e.preventDefault()
    }
    function doDelete(role_id) {
        props.doDeleteRole(props.userId, role_id, props.itemIndex)
    }
    const roles = props.roles
    let rTags = roles.map(role => (<Popconfirm key={role.id} title='确认删除？' okText="Yes" cancelText="No" onConfirm={doDelete.bind(this, role.id)}>
        <Tag closable onClose={deleteRole}>{role.value}</Tag>
        </Popconfirm>))
    if(rTags.length === 0) {
        rTags = (<div>No Role</div>)
    }
    return (<div>{rTags}</div>)
}


class User extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pagination:{pageSize:20, current:1},
            modalVisiable:false,
            modalVisiable2: false,
            roles:[]
        }

        this.columns = [
            {
                title:'ID', dataIndex:'id',key:'id',
                render: text => (<div>{text}</div>)
            },
            {
                title:'Name', dataIndex:'name',key:'name',
                render: text => (<a href=''>{text}</a>)
            },
            {
                title:'Password', dataIndex:'password',key:'password'
            },
            {
                title:'操作', dataIndex:'', key:'x',render: (text, record, index) => (<ButtonGroup>
                    <Popconfirm title='确认删除？' okText="Yes" cancelText="No" onConfirm={this.doDelete.bind(this, index, record.name)}>
                        <Button type='primary'>Delete</Button>
                    </Popconfirm>
                    <Button type='primary' icon='plus' onClick={this.showModal2.bind(this, index, record.id)}>添加角色</Button>
                    </ButtonGroup>)
            }
        ]
    }

    componentDidMount() {
        this.fetchData()
        this.fetchMeta()
    }

    render() {
        return (<div style={{overflow:'auto'}}>
            <Card bordered={false}>
                <Button type='primary' icon='plus' onClick={this.showAddUserModal}>添加用户</Button>
                <Modal title='添加用户'
                visible={this.state.modalVisiable}
                onOk={this.addUser}
                onCancel={this.hiddenAddUserModal}
                >
                <Input ref={input => this.domInput = input} type='text' placeholder='name' />
                </Modal>
                <Modal title='添加角色'
                visible={this.state.modalVisiable2}
                onOk={this.modal2Ok}
                onCancel={this.modal2Cancel}
                >
                <Select style={{ width: '100%' }} defaultValue={this.state.roles.length > 0 ? this.state.roles[0].value : ''} onChange={value => this.addRoleValue=value}>
                    {CreateOption(this.state.roles)}
                </Select>
                </Modal>
            </Card>
            <Table size='small' defaultExpandAllRows={true} dataSource={this.state.data} columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} 
            expandedRowRender={(record, index) => <OwnRoles itemIndex={index} doDeleteRole={this.doDeleteRole} userId={record.id} roles={record.sysRoleList} />}/>
        </div>)
    }

    fetchData = (pager = this.state.pagination) => {
        AFetch(Apis.auth.listUser + pager.current + '/' + pager.pageSize).then(res => res.json()).then(json => {
            if(json.code === 0) {

                let data = json.data.map(d => {
                    return {
                        id:d.id,name:d.name,password:d.password, sysRoleList:d.sysRoleList
                    }
                })
                const pager = {...this.state.pagination}
                pager.total = json.total
                this.setState({data:data, pagination:pager})
            }
        })

    }

    fetchMeta = () => {
        AFetch(Apis.role.listAll).then(res => res.json()).then(json => {
            if(json.code === 0) {
                this.setState({roles:json.data})
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
        AFetch(Apis.auth.deleteUser + name).then(res => res.json()).then(json => {
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
    showModal2 = (user_index, user_id) => {
        this.setState({
            modalVisiable2: true
        })
        this.user_id = user_id
        this.user_index = user_index
    }
    hiddenAddUserModal = () => {
        this.setState({
            modalVisiable: false
        })
    }
    modal2Cancel = () => {
        this.setState({
            modalVisiable2: false
        })
    }
    addUser = () => {
        this.setState({
            modalVisiable: false
        })
        // show
        this.doAddUser(this.domInput.input.value)
    }
    modal2Ok = () => {
        this.setState({
            modalVisiable2: false
        })
        if(!this.addRoleValue) {
            if(this.state.roles.length > 0) {
                this.addRoleValue = this.state.roles[0].id
            }
        }
        if(this.addRoleValue) {
            this.addForModal2(this.addRoleValue)
        }
    }
    doAddUser = (name) => {
        AFetch(Apis.auth.createUser + name).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let d = json.data
                data.splice(0, 0, {id:d.id, name:d.name, pasword:d.password, sysRoleList:[]})
                this.setState({data:data})
                message.info('创建用户成功')
            } else {
                message.error('创建用户失败:' + json.msg)
            }
        })
    }

    addForModal2 = (modal2Value) => {
        AFetch(Apis.user.addRole + this.user_id + '/' + modal2Value).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let d = json.data
                data[this.user_index].sysRoleList.push(d)
                this.setState({data:data})
                message.info('添加角色成功')
            } else {
                message.error('添加角色失败:' + json.msg)
            }
        })
    }

    doDeleteRole = (user_id, role_id, itemIndex) => {
        AFetch(Apis.user.deleteRole + user_id + '/' + role_id).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let item = data[itemIndex].sysRoleList
                let is = []
                item.map(i => {
                    if(i.id !== role_id) {
                        is.push(i)
                    }
                })
                data[itemIndex].sysRoleList = is
                this.setState({data:data})
                message.info('删除角色成功')
            } else {
                message.error('删除角色失败:' + json.msg)
            }
        })
    }
}

export default User