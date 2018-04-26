import React, {Component} from 'react'
import { Row, Col, Layout, Tree, Icon, Table, Button, Tag, Modal, Form, Input, message, Card, Popconfirm} from 'antd'
import {connect} from 'react-redux'
import { listTree } from '../../Redux/PromiseTask/Topic'
import { listColumns, listTables } from '../../Redux/PromiseTask/DbMeta'
import { listTable } from '../../Redux/PromiseTask/HcTable'
import Apis from '../../Api/Apis'
import '../Topic.less'

import TableSelect from '../part/TopicTableSelect'
import { AFetch } from '../../utils/AFetch';
const {TreeNode} = Tree
const ButtonGroup = Button.Group

class EditCell extends Component {
    state = {
        value: this.props.value
    }
    render() {
        const {showSave, value} = this.props
        if(showSave) {
            // input
            return <Input
                value={this.state.value}
                onChange={e => this.handleChange(e)}
            />
        } else {
            return <div>{value}</div>
        }
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value })
        this.props.onChange(value)
    }
}


function FunctionCreate(props) {
    return <div>
        <Button type='primary' onClick={props.onLoadTable}>导入数据表</Button>
    </div>
}
class App extends Component {
    state = {
        data: this.props.httpData_HcTableData.data.map(item => {
            return {...item, key: item.id}
        })
    }
    constructor(props) {
        super(props)
        this.columns = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: '表名',
            dataIndex: 'tableName',
            key: 'tableName',
          }, {
            title: '表中文名',
            dataIndex: 'metaName',
            key: 'metaName',
            render:(text, record, index) => <EditCell showSave={record.showSave} value={record.metaName} onChange={value => {
                let data = this.state.data
                record['metaName'] = value
                this.setState({data})
            }} />,
          }, {
            title: '表注释',
            dataIndex: 'comment',
            key: 'comment',
            render:(text, record, index) => <EditCell showSave={record.showSave} value={text} onChange={value => {
                let data = this.state.data
                record['comment'] = value
                this.setState({data})
            }} />,
          }, {
            title: '表标签',
            dataIndex: 'tag',
            render:(text, record, index) => <EditCell showSave={record.showSave} value={text} onChange={value => {
                let data = this.state.data
                record['tag'] = value
                this.setState({data})
            }} />,
            key: 'tag',
          }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
              <ButtonGroup>
                {record.showSave ? <Button icon='save' type="primary" onClick={_ => {
                    const {listTable} = this.props
                    let data = this.state.data
                    record.showSave = false
                    this.setState(data)
                    AFetch(Apis.table.update + `?id=${record.id}&metaName=${record.metaName}&comment=${record.comment}&tag=${record.tag}`).then(res => res.json()).then(json => {
                        if(json.code === 0) {
                            message.success('更新成功')
                            listTable()
                        } else {
                            message.error('更新失败：' + json.msg)
                        }
                    }).catch(e => {
                        message.error('更新失败-2：' + JSON.stringify(e))
                    })
                }}>保存</Button> : <Button icon='edit' type="primary" onClick={_ => {
                    let data = this.state.data
                    record._record = {...record}
                    record.showSave = true
                    this.setState(data)
                }}>编辑</Button>}
                {record.showSave ? <Button icon='reload' type="default" onClick={_ => {
                    let data = this.state.data
                    for(let key in record._record) {
                        record[key] = record._record[key]
                    }
                    record.showSave = false
                    this.setState(data)
                }}>取消</Button>:null}
                <Popconfirm title="确定要删除吗" onConfirm={() => {
                    AFetch(Apis.table.delete + record.id).then(res => res.json()).then(json => {
                        if(json.code === 0) {
                            message.success('删除成功')
                            this.props.listTable()
                        } else {
                            message.error('删除失败：' + json.msg)
                        }
                    }).catch(e => {
                        message.error('删除失败-2：' + JSON.stringify(e))
                    })
                }}>
                    <Button icon='close' type="danger">删除</Button>
                </Popconfirm>
                
              </ButtonGroup>
            ),
          }]

          this.columns2 = [{
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          },{
            title: '表名',
            dataIndex: 'name',
            key: 'name',
          },{
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return <Popconfirm title="确定要导入该表吗" onConfirm={() => {
                    AFetch(Apis.table.insert + record.name + '/NULL/NULL/NULL').then(res => res.json()).then(json => {
                        if(json.code === 0) {
                            message.success('导入成功')
                            this.props.listTable()
                        } else {
                            message.error('导入失败：' + json.msg)
                        }
                    }).catch(e => {
                        message.error('导入失败：-2：' + JSON.stringify(e))
                    })
                }}>
                    <Button type='primary' >导入</Button>
                </Popconfirm>
            }
          }]
    }
    componentDidMount() {
        let {httpData_DbMetaData, httpData_HcTableData, listTables, listTable} = this.props
        if(httpData_DbMetaData.code !== 0) {
            listTables()
        }
        if(httpData_HcTableData.code !== 0) {
            listTable()
        }
    }

    render() {
        console.log(this.state.data)
        
        let {httpData_DbMetaData, httpData_HcTableData} = this.props
        let inDbs = httpData_HcTableData.data
        let allDbs = httpData_DbMetaData.data
        allDbs = allDbs?allDbs:[]
        let index = 1
        let nodInTables = []
        allDbs.forEach(dbItem => {
            let isExist = false
            for(let i = 0; i < inDbs.length; i++) {
                let inDb = inDbs[i]
                if(inDb.tableName === dbItem.name) {
                    isExist = true
                    break
                }
            }
            if(!isExist) {
                nodInTables.push({...dbItem, id:index ++})
            }
        })

        return (<div class='table-manage' style={{background:'#fff'}}>
            <Card title="从导入数据表开始" bordered={true} style={{ width: '100%' }} 
            extra={<FunctionCreate onLoadTable={this.loadTable}/>}>
                <Table size='small' columns={this.columns} dataSource={this.state.data} />
            </Card>
            <Card title="未导入的数据表" bordered={true} style={{ width: '100%' }} id='table-manage-not-d' >
                <Table size='small' columns={this.columns2} dataSource={nodInTables} />
            </Card>
        </div>)
    }
    

    loadTable = () => {
        document.getElementById("table-manage-not-d").scrollIntoView();
    }

    componentWillReceiveProps(nextProps) {
        let {httpData_HcTableData} = nextProps
        if(httpData_HcTableData.code === 0) {
            this.setState({data:httpData_HcTableData.data.map(item => {
                return {...item, key: item.id}
            })})
        }
    }
}
function mapStateToProps(state) {
    return {
        httpData_DbMetaData: state.httpData_DbMetaData,
        httpData_HcTableData: state.httpData_HcTableData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        listTables: () => dispatch(listTables(dispatch, 'jtest001')),
        listTable: () => dispatch(listTable(dispatch)),
        updateTable: (json) => dispatch({type:'HTTP_GET_TABLES_DATA', data:json})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(App))