import React, {Component} from 'react'
import Apis from '../../Api/Apis'
import {Table, Button, message, Modal, Input, Card, Tag, Popconfirm, Select, Transfer} from 'antd'
import {AFetch, AFetchJSON} from '../../utils/AFetch'
import TransModal from './TransModal'

const ButtonGroup = Button.Group
const Option = Select.Option

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
            addRoleModalShow: false,
            roles:[], // 所有角色

            transRoles: [], // trans中选中的角色
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
                    <Button type='primary' icon='plus' onClick={this.doShowAddRoleModal.bind(this, index, record.id)}>添加角色</Button>
                    </ButtonGroup>)
            }
        ]
    }

    componentDidMount() {
        this.fetchData()
        this.fetchMeta()
    }

    render() {
        const {data, roles, targetKeys, selectedKeys} = this.state

        let transData = []
        if(this.user_has_roles) {
            const user_has_roles = this.user_has_roles
            transData = roles.filter(item => this.user_has_roles.indexOf(item.id) === -1).map(item => {
                return {
                    key: item.id,
                    title: item.value,
                }
            })
        } else {
            transData = roles.map(item => {
                return {
                    key: item.id,
                    title: item.value,
                }
            })
        }
        return (<div style={{overflow:'auto'}}>
            <Card bordered={false}>
                <Button type='primary' icon='plus' onClick={_ => this.setState({modalVisiable: true})}>添加用户</Button>
                <Modal title='添加用户'
                visible={this.state.modalVisiable}
                onOk={this.addUser}
                onCancel={_ => this.setState({modalVisiable: false})}
                >
                <Input ref={input => this.domInput = input} type='text' placeholder='name' />
                </Modal>
                <TransModal
                    title='添加角色'
                    visible={this.state.addRoleModalShow}
                    ok={this.doAddRole}
                    cancel={_ => this.setState({addRoleModalShow: false})}
                    onChange={this.handleRoleTransChange}
                    data={transData}
                    titles={['所有角色', '已选角色']}
                    targetKeys={this.state.transRoles}
                />

            </Card>
            <Table size='small' defaultExpandAllRows={true} dataSource={this.state.data} columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange} 
            expandedRowRender={(record, index) => <OwnRoles itemIndex={index} doDeleteRole={this.doDeleteRole} userId={record.id} roles={record.sysRoleList} />}/>
        </div>)
    }

    handleRoleTransChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ transRoles: nextTargetKeys });
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

    // 分页查询
    handleTableChange = (pagination, filters, storter) => {
        const pager = {...this.state.pagination}
        pager.current = pagination.current
        this.setState({pagination:pager})
        this.fetchData(pager)
    }



    // 显示添加角色modal 添加角色按钮触发
    doShowAddRoleModal = (user_index, user_id) => {
        const {data} = this.state
        if(data[user_index] && data[user_index].sysRoleList) {
            this.user_has_roles = data[user_index].sysRoleList.map(item => item.id)
        }
        this.setState({
            addRoleModalShow: true
        })
        this.user_id = user_id
        this.user_index = user_index
    }


    addUser = () => {
        this.setState({
            modalVisiable: false
        })
        // show
        this.doAddUser(this.domInput.input.value)
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
    // 删除用户
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

    doAddRole = () => {
        const {transRoles} = this.state
        this.setState({
            addRoleModalShow: false
        })
        if(transRoles.length > 0) {
            AFetchJSON(Apis.user.addRoles + this.user_id + '/' + JSON.stringify(transRoles)).then(json => {
                if(json.code === 0) {
                    let data = this.state.data
                    data[this.user_index].sysRoleList = [...data[this.user_index].sysRoleList, ...json.data]
                    this.setState({data:data})
                    message.info('创建用户成功')
                } else {
                    message.error('添加角色失败:' + json.msg)
                }
            })
        }
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