import React, {Component} from 'react'
import Apis from '../../Api/Apis'
import {Table, Button, message, Modal, Input, Card, Tag, Popconfirm, Select, AutoComplete} from 'antd'
import {AFetch} from '../../utils/AFetch'
import {connect} from 'react-redux'
import { listTable } from '../../Redux/PromiseTask/HcTable'


const ButtonGroup = Button.Group
const Option = Select.Option

function CreateOption(datas) {
    return datas.map(data => (<Option value={data.id} key={data.id}>{data.permission}</Option>))
}

function OwnPermissions(props) {
    function deleteRole(e) {
        e.preventDefault()
    }
    function doDelete(permission_id) {
        props.doDeletePermission(props.roleId, permission_id, props.itemIndex)
    }
    function doDelete2(table_id) {
        props.doDeleteTable(props.roleId, table_id, props.itemIndex)
    }
    let data = props.data.sysPermissionList
    data = data ? data : []
    let rTags = data.map(permission => (<Popconfirm title='确认删除？'  key={permission.id} okText="Yes" cancelText="No" onConfirm={doDelete.bind(this, permission.id)}>
        <Tag color="cyan" closable onClose={deleteRole}>{permission.permission}</Tag>
        </Popconfirm>))
    if(rTags.length === 0) {
        rTags = (<div>No Permissions</div>)
    }
    data = props.data.hcTableList
    data = data ? data : []
    let rTags2 = data.map(table => (<Popconfirm title='确认删除？'  key={table.id} okText="Yes" cancelText="No" onConfirm={doDelete2.bind(this, table.id)}>
        <Tag color="green-inverse" closable onClose={deleteRole}>{table.tableName}</Tag>
        </Popconfirm>))
    if(rTags2.length === 0) {
        rTags2 = (<div>No Tables</div>)
    }
    return (<div><div><p>操作权限：</p>{rTags}</div><div style={{marginTop:10}}><p>数据表拥有：</p>{rTags2}</div></div>)
}

class Role extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pagination:{pageSize:20, current:1},
            modalVisiable:false,
            modalVisiable2:false,
            modalVisiable3:false,
            permissions:[],
            addTableName:'',
        }

        this.columns = [
            {
                title:'ID', dataIndex:'id',key:'id',
                render: text => (<div>{text}</div>)
            },
            {
                title:'Value', dataIndex:'value',key:'value',
                render: text => (<a href=''>{text}</a>)
            },
            {
                title:'State', dataIndex:'state',key:'state'
            },
            {
                title:'操作', dataIndex:'', key:'x',render: (text, record, index) => (<ButtonGroup>
                    <Popconfirm title='确认删除？' okText="Yes" cancelText="No" onConfirm={this.doDelete.bind(this, index, record.value)}>
                        <Button type='primary'>Delete</Button>
                    </Popconfirm>
                    <Button type='primary' icon='plus' onClick={this.showModal2.bind(this, index, record.id)}>添加权限</Button>
                    <Button type='primary' icon='plus' onClick={this.showModal3.bind(this, index, record.id)}>表授权</Button>
                    </ButtonGroup>
                
            )
            }
        ]
    }

    componentDidMount() {
        let {httpData_HcTableData, listTable} = this.props
        
        this.fetchData()
        this.fetchMeta()
        if(httpData_HcTableData.code !== 0) {
            listTable()
        }
    }

    render() {
        let {httpData_HcTableData} = this.props
        let data = httpData_HcTableData.data
        data = data ? data:[]
        let d = []
        httpData_HcTableData.data.forEach(item => {
            d.push(`${item.metaName}(${item.tableName})`)
        })
        return (<div style={{overflow:'auto'}}>
            <Card bordered={false}>
                <Button type='primary' icon='plus' onClick={this.showAddUserModal}>添加角色</Button>
                <Modal title='添加角色'
                visible={this.state.modalVisiable}
                onOk={this.addUser}
                onCancel={this.modalCancel}
                okText='确认添加'
                cancelText='取消'
                >
                <Input ref={input => this.domInput = input} type='text' placeholder='role[admin,custom..]' />
                </Modal>
                <Modal title='添加权限'
                visible={this.state.modalVisiable2}
                onOk={this.modal2Ok}
                onCancel={this.modalCancel}
                okText='确认添加'
                cancelText='取消'
                >
                <Select style={{ width: '100%' }} defaultValue={this.state.permissions.length > 0 ? this.state.permissions[0].permission : ''} onChange={value => this.addPermissionValue=value}>
                    {CreateOption(this.state.permissions)}
                </Select>
                </Modal>
                <Modal title='添加表授权'
                    visible={this.state.modalVisiable3}
                    onOk={this.addTable}
                    onCancel={this.modalCancel}
                    okText='确认添加'
                    cancelText='取消'
                >
                <AutoComplete
                    onChange={value => this.setState({addTableName: value})}
                    style={{ width: '100%' }}
                    dataSource={d}
                    value={this.state.addTableName}
                    placeholder="输入表名字"
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                />
                </Modal>

            </Card>
            <Table 
            size='small'
            defaultExpandAllRows={true}
            expandedRowRender={(record, index) => <OwnPermissions itemIndex={index} doDeleteTable={this.doDeleteTable} doDeletePermission={this.doDeletePermission} roleId={record.id} data={record.exp} />}
            dataSource={this.state.data} columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange}/>
        </div>)
    }

    fetchData = (pager = this.state.pagination) => {
        AFetch(Apis.auth.listRole + pager.current + '/' + pager.pageSize).then(res => res.json()).then(json => {
            if(json.code === 0) {

                let data = json.data.map(d => {
                    return {
                        key:d.id,id:d.id,value:d.value,state:d.state, exp: {sysPermissionList: d.sysPermissionList ? d.sysPermissionList : [], hcTableList:d.hcTableList ? d.hcTableList : []}
                    }
                })
                const pager = {...this.state.pagination}
                pager.total = json.total
                this.setState({data:data, pagination:pager})
            }
        })

    }

    fetchMeta = () => {
        AFetch(Apis.permission.listAll).then(res => res.json()).then(json => {
            if(json.code === 0) {
                this.setState({permissions:json.data})
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
        AFetch(Apis.auth.deleteRole + name).then(res => res.json()).then(json => {
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

    showModal2 = (role_index, role_id) => {
        this.setState({
            modalVisiable2: true
        })
        this.role_id = role_id
        this.role_index = role_index
    }

    showModal3 = (role_index, role_id) => {
        this.setState({
            modalVisiable3: true
        })
        this.role_id = role_id
        this.role_index = role_index
    }
    modalCancel = () => {
        this.setState({
            modalVisiable2: false,
            modalVisiable: false,
            modalVisiable3:false,
        })
    }
    addTable = () => {
        this.modalCancel()
        let {httpData_HcTableData} = this.props
        let data = httpData_HcTableData.data
        data = data ? data:[]

        for(let i = 0; i < data.length; i++) {
            if(`${data[i].metaName}(${data[i].tableName})` === this.state.addTableName) {
                AFetch(Apis.table.addRole + data[i].id + '/' + this.role_id).then(res => res.json()).then(json => {
                    if(json.code === 0) {
                        let data = this.state.data
                        let d = json.data
                        data[this.role_index].exp.hcTableList.push(d)
                        this.setState({data:data})
                        message.success('添加授权成功')
                    } else {
                        message.error('添加授权失败：' + json.msg)
                    }
                }).catch(e => {
                    message.warn('添加授权失败-2：' + JSON.stringify(e))
                })
                this.setState({addTableName: ''})
                return
            }
        }
        message.warn('没有该数据库')
        this.setState({addTableName: ''})
    }
    modal2Ok = () => {
        this.setState({
            modalVisiable2: false
        })
        if(!this.addPermissionValue) {
            if(this.state.permissions.length > 0) {
                this.addPermissionValue = this.state.permissions[0].id
            }
        }
        if(this.addPermissionValue) {
            this.addForModal2(this.addPermissionValue)
        }
    }
    addForModal2 = (modal2Value) => {
        AFetch(Apis.role.addPermission + this.role_id + '/' + modal2Value).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let d = json.data
                data[this.role_index].exp.sysPermissionList.push(d)
                this.setState({data:data})
                message.info('添加权限成功')
            } else {
                message.error('添加权限失败:' + json.msg)
            }
        })
    }
    showAddUserModal = () => {
        this.setState({
            modalVisiable: true
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
        AFetch(Apis.auth.createRole + name).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let d = json.data
                data.splice(data.length, 0, {id:d.id, key: d.id, value:d.value, state:d.state, exp:{sysPermissionList:[],hcTableList:[]}})
                this.setState({data:data})
                message.info('创建角色成功')
            } else {
                message.error('创建角色失败:' + json.msg)
            }
        })
    }
    doDeletePermission = (role_id, permission_id, itemIndex) => {
        AFetch(Apis.role.deletePermission + role_id + '/' + permission_id).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let item = data[itemIndex].exp.sysPermissionList
                let is = []
                item.forEach(i => {
                    if(i.id !== permission_id) {
                        is.push(i)
                    }
                })
                data[itemIndex].exp.sysPermissionList = is
                this.setState({data:data})
                message.info('删除权限成功')
            } else {
                message.error('删除权限失败:' + json.msg)
            }
        }).catch(e => {
            message.error('删除权限失败-2:' + JSON.stringify(e))
        })
    }
    doDeleteTable = (role_id, table_id, itemIndex) => {
        AFetch(Apis.table.deleteRoleTable+ role_id + '/' + table_id).then(res => res.json()).then(json => {
            if(json.code === 0) {
                let data = this.state.data
                let item = data[itemIndex].exp.hcTableList
                let is = []
                item.forEach(i => {
                    if(i.id !== table_id) {
                        is.push(i)
                    }
                })
                data[itemIndex].exp.hcTableList = is
                this.setState({data:data})
                message.info('删除表关联成功')
            } else {
                message.error('删除表关联失败:' + json.msg)
            }
        }).catch(e => {
            message.error('删除表关联失败-2:' + JSON.stringify(e))
        })
    }
}

function mapStateToProps(state) {
    return {
        httpData_HcTableData: state.httpData_HcTableData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        listTable: () => dispatch(listTable(dispatch)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Role)