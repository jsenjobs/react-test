import React, {Component} from 'react'
import Apis from '../../Api/Apis'
import {Table, Button, message, Modal, Input, Card, Tag, Popconfirm, Select, AutoComplete} from 'antd'
import {AFetchJSON} from '../../utils/AFetch'
import {connect} from 'react-redux'
import { listTable } from '../../Redux/PromiseTask/HcTable'
import TransModal from './TransModal'


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
            addRoleModalShow: false,
            addPermissionModalShow:false,
            addPermissionTableModalShow:false,
            permissions:[],

            transPermmisions:[],
            transPermmisionTables:[],
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
                    <Button type='primary' icon='plus' onClick={this.doShowAddPermissionModal.bind(this, index, record.id)}>添加权限</Button>
                    <Button type='primary' icon='plus' onClick={this.doShowAddPermissionTableModal.bind(this, index, record.id)}>表授权</Button>
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

        const {permissions} = this.state

        let transPermissionData = []
        if(this.role_has_permissions) {
            const role_has_permissions = this.role_has_permissions
            transPermissionData = permissions.filter(item => role_has_permissions.indexOf(item.id) === -1).map(item => {
                return {
                    key: item.id,
                    title: item.permission,
                }
            })
        } else {
            transPermissionData = permissions.map(item => {
                return {
                    key: item.id,
                    title: item.permission,
                }
            })
        }
        let tables = httpData_HcTableData.data ? httpData_HcTableData.data : []
        let transTableData = []
        if(this.role_has_tables) {
            const role_has_tables = this.role_has_tables
            transTableData = tables.filter(item => role_has_tables.indexOf(item.id) === -1).map(item => {
                return {
                    key: item.id,
                    title: `${item.metaName}(${item.tableName})`,
                }
            })
        } else {
            transTableData = tables.map(item => {
                return {
                    key: item.id,
                    title: `${item.metaName}(${item.tableName})`,
                }
            })
        }
        return (<div style={{overflow:'auto'}}>
            <Card bordered={false}>
                <Button type='primary' icon='plus' onClick={this.showAddUserModal}>添加角色</Button>
                <Modal title='添加角色'
                visible={this.state.addRoleModalShow}
                onOk={this.addUser}
                onCancel={_ => this.setState({addRoleModalShow: false})}
                okText='确认添加'
                cancelText='取消'
                >
                <Input ref={input => this.domInput = input} type='text' placeholder='role[admin,custom..]' />
                </Modal>
                <TransModal
                    title='添加权限'
                    visible={this.state.addPermissionModalShow}
                    ok={this.doAddPermission}
                    cancel={_ => this.setState({addPermissionModalShow: false})}
                    okText='确认添加'
                    cancelText='取消'
                    onChange={(nextTargetKeys, direction, moveKeys) => {
                        this.setState({ transPermmisions: nextTargetKeys });
                    }}
                    data={transPermissionData}
                    titles={['所有权限', '已选权限']}
                    targetKeys={this.state.transPermmisions}
                />
                <TransModal
                    title='添加表授权'
                    visible={this.state.addPermissionTableModalShow}
                    ok={this.doAddTable}
                    cancel={_ => this.setState({addPermissionTableModalShow: false})}
                    okText='确认添加'
                    cancelText='取消'
                    onChange={(nextTargetKeys, direction, moveKeys) => {
                        this.setState({ transPermmisionTables: nextTargetKeys });
                    }}
                    data={transTableData}
                    titles={['所有表', '已选表']}
                    targetKeys={this.state.transPermmisionTables}
                />

            </Card>
            <Table 
            size='small'
            defaultExpandAllRows={true}
            expandedRowRender={(record, index) => <OwnPermissions itemIndex={index} doDeleteTable={this.doDeleteTable} doDeletePermission={this.doDeletePermission} roleId={record.id} data={record.exp} />}
            dataSource={this.state.data} columns={this.columns} pagination={this.state.pagination} onChange={this.handleTableChange}/>
        </div>)
    }

    fetchData = (pager = this.state.pagination) => {
        AFetchJSON(Apis.auth.listRole + pager.current + '/' + pager.pageSize).then(json => {
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
        AFetchJSON(Apis.permission.listAll).then(json => {
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

    // 显示Modal
    doShowAddPermissionModal = (role_index, role_id) => {
        const {data} = this.state
        if(data[role_index] && data[role_index].exp.sysPermissionList) {
            this.role_has_permissions = data[role_index].exp.sysPermissionList.map(item => item.id)
        }

        this.setState({
            addPermissionModalShow: true
        })
        this.role_id = role_id
        this.role_index = role_index
    }
    // 显示Modal
    doShowAddPermissionTableModal = (role_index, role_id) => {
        const {data} = this.state
        
        if(data[role_index] && data[role_index].exp.hcTableList) {
            this.role_has_tables = data[role_index].exp.hcTableList.map(item => item.id)
        }
        
        this.setState({
            addPermissionTableModalShow: true,
        })
        this.role_id = role_id
        this.role_index = role_index
    }

    
    doAddTable = () => {
        const {transPermmisionTables} = this.state
        this.setState({
            addPermissionTableModalShow: false
        })

        if(transPermmisionTables.length > 0) {
            AFetchJSON(Apis.table.addsRole + JSON.stringify(transPermmisionTables) + '/' + this.role_id).then(json => {
                if(json.code === 0) {
                    let data = this.state.data
                    data[this.role_index].exp.hcTableList = [...data[this.role_index].exp.hcTableList, ...json.data]
                    this.setState({data:data})
                    message.info('添加授权成功')
                } else {
                    message.error('添加授权失败：:' + json.msg)
                }
            })
        }
    }
    doAddPermission = () => {

        const {transPermmisions} = this.state

        this.setState({
            addPermissionModalShow: false
        })

        if(transPermmisions.length > 0) {
            AFetchJSON(Apis.role.addPermissions + this.role_id + '/' + JSON.stringify(transPermmisions)).then(json => {
                if(json.code === 0) {
                    let data = this.state.data
                    data[this.role_index].exp.sysPermissionList = [...data[this.role_index].exp.sysPermissionList, ...json.data]
                    this.setState({data:data})
                    message.info('添加权限成功')
                } else {
                    message.error('添加权限失败:' + json.msg)
                }
            })
        }

    }

    showAddUserModal = () => {
        this.setState({
            addRoleModalShow: true
        })
    }
    addUser = () => {
        this.setState({
            addRoleModalShow: false
        })
        // show
        this.doAddUser(this.domInput.input.value)
    }
    doAddUser = (name) => {
        AFetchJSON(Apis.auth.createRole + name).then(json => {
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

    // 删除角色
    doDelete = (index, name) => {
        AFetchJSON(Apis.auth.deleteRole + name).then(json => {
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
    // 删除权限
    doDeletePermission = (role_id, permission_id, itemIndex) => {
        AFetchJSON(Apis.role.deletePermission + role_id + '/' + permission_id).then(json => {
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
        })
    }
    // 删除表
    doDeleteTable = (role_id, table_id, itemIndex) => {
        AFetchJSON(Apis.table.deleteRoleTable+ role_id + '/' + table_id).then(json => {
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