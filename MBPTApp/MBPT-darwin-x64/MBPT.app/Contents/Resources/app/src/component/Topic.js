import React, {Component} from 'react'
import { Row, Col, Layout, Tree, Icon, Table, Button, Tag, Modal, Form, Input, message, Popover} from 'antd'
import {connect} from 'react-redux'
import { listTree } from '../Redux/PromiseTask/Topic'
import { listTable } from '../Redux/PromiseTask/HcTable'
import Apis from '../Api/Apis'
import './Topic.css'
import { Margin } from 'gojs';
import {AFetch} from '../utils/AFetch'

import TableSelect from './part/TopicTableSelect'
const {TreeNode} = Tree
const ButtonGroup = Button.Group
const FormItem = Form.Item

let Datas = {}
class CreateTree extends Component {
    state = {
        selectedKeys: []
    }
    render() {
        let props = this.props
        const treeData = props.treeData
        Datas = {}
        let self = this
        function build(data, type='topic') {
            const nodes = data.map(d => {
                if(d._tables) {
                    Datas['sub-topic-' + d.id] = d._tables
                    return (<TreeNode id={d.id} title={<Popover 
                        visible={self.state[d.id]} 
                        onVisibleChange={v => self.onVisibleChange(v, d.id)} placement="rightTop" trigger='contextMenu' 
                        content={<div><div style={{cursor:'pointer'}} onClick={_ => self.onTable(d.id)}>添加表关联</div><div style={{cursor:'pointer'}}>删除该子主题</div></div>} 
                        title="操作">{d.name}</Popover>} key={'sub-topic-' + d.id} />)
                    //const subs = build(d._tables, 'table')
                    //return (<TreeNode icon={<Icon type="smile-o" />} title={d.name} key={'topic-' + d.id}>{subs}</TreeNode>)
                } else if(d._children) {
                    const subs = build(d._children)
                    return (<TreeNode id={d.id} title={<Popover visible={self.state[d.id]} 
                        onVisibleChange={v => self.onVisibleChange(v, d.id)}  placement="rightTop" trigger='contextMenu' 
                        content={<div><div style={{cursor:'pointer'}} onClick={_ => self.onSubTopic(d.id)}>添加子主题</div>
                        <div style={{cursor:'pointer'}}>删除该主题</div><div onClick={_ => self.onTopic(d.id)} style={{cursor:'pointer'}}>添加主题</div></div>} 
                        title="操作">{d.name}</Popover>} key={'topic-' + d.id}>{subs}</TreeNode>)
                } else {
                    return (<TreeNode id={d.id} title={<Popover visible={self.state[d.id]} 
                        onVisibleChange={v => self.onVisibleChange(v, d.id)}  placement="rightTop" trigger='contextMenu' 
                        content={<div><div style={{cursor:'pointer'}} onClick={_ => self.onSubTopic(d.id)}>添加子主题</div>
                        <div style={{cursor:'pointer'}}>删除该主题</div><div onClick={_ => self.onTopic(d.id)} style={{cursor:'pointer'}}>添加主题</div></div>} 
                        title="操作">{d.name}</Popover>} key={'topic-' + d.id} />)
                }
            })
            return nodes
        }
        return (<Tree
            selectedKeys={this.state.selectedKeys}
            onSelect={this.onSelect}>
            {build(treeData)}
            </Tree>)
    }

    onTable = (id) => {
        this.onVisibleChange(false, id)
        this.props.doAddTable(id)
    }

    onSubTopic = (id) => {
        this.onVisibleChange(false, id)
        this.props.doAddSubTopic(id)
    }

    onTopic = (id) => {
        this.onVisibleChange(false, id)
        this.props.doAddTopic()
    }

    onSelect = (selectedKeys, e) => {
        let s = {}
        s[e.node.props.id] = false
        this.setState(s)
        this.props.onSelect(selectedKeys, e)
    }
    onVisibleChange = (v, id) => {
        let s = {}
        s[id] = v
        this.setState(s)
    }
}
function CreateFunction(props) {
    // <Tag style={{margin:0}} color="orange">{hold}</Tag>
    const {selectedType, hold} = props
    return selectedType ? selectedType === 'topic' ? (<ButtonGroup style={{width:'100%', ...props.style}}>
    <Button onClick={_ => props.showModal('showAddTopic')} style={{width:'50%'}} type="normal">添加主题</Button>
    <Button onClick={_ => props.showModal('showAddSubTopic')} style={{width:'50%'}} type="dashed">添加子主题</Button>
    </ButtonGroup>) 
    : (<ButtonGroup style={{width:'100%', ...props.style}}>
    <Button onClick={_ => props.showModal('showAddTopic')} style={{width:'50%'}} type="normal">添加主题</Button>
    <Button onClick={_ => props.showModal('showAddTables')} style={{width:'50%'}} style={{width:'50%'}} type="dashed">添加表关联</Button></ButtonGroup>) 
    : (<ButtonGroup style={{width:'100%', ...props.style}}><Button onClick={_ => props.showModal('showAddTopic')} style={{width:'50%'}} type="normal">添加主题</Button></ButtonGroup>)
}

class App extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title:'ID', dataIndex:'id',key:'key',
                render: text => (<div>{text}</div>)
            },
            {
                title:'TableName', dataIndex:'tableName',key:'tableName'
            },
            {
                title:'中文名字', dataIndex:'metaName',key:'metaName'
            },
            {
                title:'comment', dataIndex:'comment',key:'comment'
            },
            {
                title:'Tag', dataIndex:'tag',key:'tag'
            }
        ]
    }
    state = {
        selectedData:[], //某个主题下的数据表 DataSource
        selectedType:null,
        selectedTitle:'',
        selectedId:-1,

        showAddTopic: false,
        showAddSubTopic: false,
        showAddTables: false,

        tableSelectedKeys:[],
    };
    componentDidMount() {
        let {httpData_TopicTreeData, httpData_HcTableData, listTree, listTable} = this.props
        if(httpData_TopicTreeData.code !== 0) {
            listTree()
        }
        if(httpData_HcTableData.code !== 0) {
            listTable()
        }
    }

    render() {
        const {httpData_HcTableData} = this.props
        let s = []
        if(httpData_HcTableData.data) {
            s = httpData_HcTableData.data.map((item, index) => {
                return {
                    key: item.id,
                    title:  `${item.metaName}(${item.tableName})`,
                    description: `description of content${item.metaName}`
                }
            })
        }
        const { getFieldDecorator } = this.props.form
        let data = this.props.httpData_TopicTreeData.data
        data = data ? data : []
        return (<div class='add-topic' style={{background:'#fff'}}>
            <Modal
                title="添加主题"
                footer={null}
                visible={this.state.showAddTopic}
                onCancel={this.modalCancel}
            >
                <Form onSubmit={this.modalOkTopic} className="login-form">
                    <FormItem>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '需要主题名字' }],
                    })(
                        <Input placeholder="主题名字" />
                    )}
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator('comment', {
                        rules: [{ required: true, message: '需要主题注释' }],
                    })(
                        <Input type="text" placeholder="主题注释" />
                    )}
                    </FormItem>
                    <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        添加主题
                    </Button>
                    </FormItem>
                </Form>
            </Modal>
            <Modal
                title="添加子主题"
                visible={this.state.showAddSubTopic}
                footer={null}
                onCancel={this.modalCancel}
            >
            <Form onSubmit={this.modalOkSubTopic} className="login-form">
                <FormItem>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '需要子主题名字' }],
                })(
                    <Input placeholder="子主题名字" />
                )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('comment', {
                    rules: [{ required: true, message: '需要主题注释' }],
                })(
                    <Input type="text" placeholder="主题注释" />
                )}
                </FormItem>
                <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    添加主题
                </Button>
                </FormItem>
            </Form>
            </Modal>
            <TableSelect dataSource={s} targetKeys={this.state.tableSelectedKeys} visible={this.state.showAddTables} 
            onOk={this.handleSaveTables} onCancel={this.modalCancel}
             handleChange={this.handleSelectTableChange}/>
            <CreateFunction showModal={this.showModal} style={{marginBottom:'20px'}} hold={this.state.selectedTitle} selectedType={this.state.selectedType} />
            <Row type="flex" style={{height:'100%'}} justify="start">
                <Col span={6}>
                <CreateTree treeData={data}
                 onSelect = {this.onSelect} 
                 doAddTopic={_ => this.setState({showAddTopic:true})} 
                 doAddSubTopic={id => {
                    this.setState({showAddSubTopic:true, selectedId: id})
                }} 
                doAddTable={id => {
                    this.setState({showAddTables:true, selectedId: id})
                }}/>
                </Col>
                <Col span={18}> <Table size="small" dataSource={this.state.selectedData} columns={this.columns} /></Col>
            </Row>
        </div>)
    }
    handleSelectTableChange = (nextTargetKeys, direction, moveKeys) => {

        //console.log('targetKeys: ', this.state.tableSelectedKeys);
        //console.log('direction: ', direction);
        //console.log('moveKeys: ', moveKeys);

        this.setState({ tableSelectedKeys: nextTargetKeys })
    }
    handleSaveTables = () => {
        this.modalCancel()
        AFetch(Apis.table.addTopic + JSON.stringify(this.state.tableSelectedKeys) + '/' + this.state.selectedId).then(res => res.json()).then(json => {
            if(json.code === 0) {
                  this.props.listTree()
                  message.success('关联表成功')
            } else {
              message.warn('关联表失败:' + json.msg);
            }
        }).catch(e => {
          message.error('关联表成功失败:' + JSON.stringify(e));
        })
    }

    modalCancel = () => {
        this.setState({
            showAddTopic:false,
            showAddSubTopic:false,
            showAddTables: false
        })
    }
    modalOkTopic = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              AFetch(Apis.topic.addTopic + values.name + '/' + values.comment).then(res => res.json()).then(json => {
                  if(json.code === 0) {
                        this.props.listTree()
                        message.success('添加主题成功')
                        this.modalCancel()
                  } else {
                    message.warn('添加主题失败:' + json.msg);
                  }
              }).catch(e => {
                message.error('添加主题失败:' + JSON.stringify(e));
              })
            }
        });
    }
    modalOkSubTopic = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              AFetch(Apis.topic.addSubTopic + values.name + '/' + values.comment + '/' + this.state.selectedId).then(res => res.json()).then(json => {
                  if(json.code === 0) {
                        this.props.listTree()
                        message.success('添加子主题成功')
                        this.modalCancel()
                  } else {
                    message.warn('添加子主题失败:' + json.msg);
                  }
              }).catch(e => {
                message.error('添加子主题失败:' + JSON.stringify(e));
              })
            }
        });
    }

    onSelect = (selectedKeys, info) => {
        let data = Datas[info.node.props.eventKey]
        let state = {}
        state.selectedId = info.node.props.id
        state.selectedData = data
        state.selectedTitle = info.node.props.title
        if(data) {
            state.selectedType = 'sub'
        } else {
            state.selectedType = 'topic'
        }
        this.setState(state)
    }

    showModal = (type) => {
        let state = {}
        state[type] = true
        this.setState(state)
    }
}
function mapStateToProps(state) {
    return {
        httpData_TopicTreeData: state.httpData_TopicTreeData,
        httpData_HcTableData: state.httpData_HcTableData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        listTree: () => dispatch(listTree(dispatch)),
        listTable: () => dispatch(listTable(dispatch)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(App))