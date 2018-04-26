import React, {Component} from 'react'
import SelfCal from './part/SelfCal'
import Agg from './part/Agg'
import graph from './testdata.json'
import './ModelEdit.css'
import './ModelEdit.less'
import {Layout, Tree, Menu, Button, Icon, Modal, Form, Collapse, message, Popconfirm, Popover} from 'antd'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import { listTree } from '../Redux/PromiseTask/Topic'
import { listUserModel } from '../Redux/PromiseTask/UserModel'
import {listColumnInfoByTableName} from '../Redux/PromiseTask/TableColumnInfo'
import {AFetch, AFetchJSON} from '../utils/AFetch'
import Apis from '../Api/Apis'

import Modals from './Modals'

import {setCanDrag,getCanDrag, dragStart, drag, dragEnd, updatePosition} from '../utils/d3core/MoveAction'
import {mouseover, mouseout} from '../utils/d3core/MouseAction'
import {Create} from '../utils/d3core/Creator'
import {checkRule} from '../utils/d3core/RuleChecker'
import {deleteNode} from '../utils/d3core/CRUD'
import DataType from '../utils/d3core/ModelTypes'
import {CreateAndRefresh} from '../utils/d3core/UI/DataCreate'
import {CreateLink, CreateNode, CreateUnionNode, CreateLabel} from '../utils/d3core/UI/ModeCreate'
import {initEvent, initDatas, resetDatas} from '../utils/d3core/UI/Initer'
import {checkNodePosition} from '../utils/d3core/UI/AreaChecker'
import {getTransformXY, getNodeDataById} from '../utils/d3core/UI/Utils'
import {updateValueById, removeAll, getDatas, getUnionDatas, addUnionData, getLinks, addData, addLink, getLinkCenter, spliceData, spliceLink} from '../utils/d3core/ModelConf'
import {save as coreSave, execModelPart as coreExecModelPart, execModel as coreExecModel, execModelPart} from '../utils/d3core/Exec/ModelExec'
import {createShare as coreCreateShare, updateShareModel as coreUpdateShareModel, updateModelName as coreUpdateModelName} from '../utils/d3core/Exec/ModelShare'

import {createTree} from './ModelEditComponent/ModelTree'
import {ColumnsShow} from './ModelEditComponent/Columns'
import ModelColumnFilter from './ModelEditComponent/ModelColumnFilter'
import ModelInfoEditor from './ModelEditComponent/ModelInfoEditer'
import ModelExecResult from './ModelEditComponent/ModelExecResult'
import 'whatwg-fetch'
import {uuid} from '../utils/UUID'
const ButtonGroup = Button.Group
const {Header, Content, Sider} = Layout
const {TreeNode} = Tree
const Panel = Collapse.Panel;
var d3 = require('d3')

// const rect = Conf.rect
// const circle = Conf.circle
// const container = Conf.container

let hock = {
    // 模型拖动相关
    triggerSourceNode:null, // 拖动选中的模型的配置信息
    triggerTargetNode:null, // 拖动选中的模型的配置信息
    triggerPath:null, //创建的用于拖动的线条
    // tree 相关
    toggleSourceData:null, // 左边树的拖动的节点的数据信息
}
let link
let i = 0
class ModelEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // display: this.props.display,
            // svg work bench 拖动的鼠标形状
            cursor:'default', 
            isDragg: false, //设置下是不是在drag状态
            visibleSelfCalModal: false,
            visibleAggModal: false,

            modalRenameShow:false,
            modalCreateShareModelShow: false,


            // conf
            currentFileName:'未命名',
            intro:'',
            lastSaveTime:new Date().toLocaleString(),
            isEdited:false,

            // ui
            defaultAttrPanelWidth: 360,
            defaultEditorPanelWidth: 'calc(100% - 360px)',
            defaultTreePanelWidth: 300,

            isLeftTogglet: false,
            isRightTogglet: false,

            currentModelId:-1, // 当前编辑模型的ID，数据库中

            treeExpandNodes:['-topic'],

            currentSelectedNode:null, // 当前点击选中的节点
            currentSelectedNodeConf:null, // 当前点击选中的节点
            // attr 面板
            tableFilters:{}, // 保存对table的Filer设置
            attrActivePanel: ['1','2','3','4'],
            execResult:{}, //保存从服务器返回的执行结果
            updateFlag:1,
        }
        this._hock = hock
    }
    onCancel = (key) => {
        let obj = {}
        obj[key] = false
        this.setState(obj)
    }
    onCreate = (key) => {
        let obj = {}
        obj[key] = false
        this.setState(obj)
    }
    render() {
        let dbColumns = this.props.httpData_TableColumnInfo[this.state.currentSelectedNode]
        let tableFilter = this.state.tableFilters[this.state.currentSelectedNode]
        let currentExecResult = this.state.execResult[this.state.currentSelectedNode]
        if(!tableFilter) tableFilter = []
        if(!currentExecResult) currentExecResult = []
        let dbFileds = []
        if(dbColumns) {
            dbFileds = dbColumns.map(column => column.field)
        }
        return (
            <div id='mbase' onMouseDown={this.handleMouseDown} onMouseMove = {this.handleMouseMove} onMouseUp={this.handleMouseUp}>
            <svg className='shot-container' />
            <SelfCal 
            currentSelectedNode={this.state.currentSelectedNode}
            currentSelectedNodeConf={this.state.currentSelectedNodeConf}
            visible={this.state.visibleSelfCalModal} 
            onCancel={this.onCancel.bind(this, 'visibleSelfCalModal')} 
            onCreate={this.onCreate.bind(this, 'visibleSelfCalModal')} 
            />
            <Agg visible={this.state.visibleAggModal} 
            triggerSourceConf={hock.triggerSourceNode}
            triggerTargetConf={hock.triggerTargetNode}
            onCancel={this.onCancel.bind(this, 'visibleAggModal')}
             onCreate={this.onCreate.bind(this, 'visibleAggModal')}/>
            <Layout style={{height:'100%'}}>
            <Sider width={this.state.defaultTreePanelWidth} style={{transition:'none'}}>
                {createTree(this)}
            </Sider>
                        
            <div className='model-edit-move-line'
            style={{left:this.state.defaultTreePanelWidth}} 
            ref={d => this.domResizeLineLeft = d}>
                <div className={this.state.isLeftTogglet ? 'left-toggle- left-toggle-show' : 'left-toggle- left-toggle'} >
                <div className='point-to-right' />
                </div>
            </div>
            <Layout>
              <Header style={{ padding:0}}>
                <span style={{color:'#fff', float:'left', paddingLeft:'10px', fontSize:'1.4em', cursor:'pointer'}} onClick={_ => this.props.history.goBack()}>返回</span>
                <ButtonGroup
                    className='function-btn'
                    style={{color:'#fff', float:'left', paddingLeft:'1%'}}>
                    <Button type="primary" icon="save"  onClick={this.save}>保存</Button>
                    <Button type="primary" icon="edit"  onClick={_ => this.setState({modalRenameShow:true})}>重命名</Button>
                    <Popconfirm title='新建模型将删除已有的模型进度，确定？' okText="确定" cancelText="取消" onConfirm={_ => {
                        this.resetUserData()
                    }}>
                        <Button type="primary" icon="plus" >新建模型</Button>
                    </Popconfirm>
                    <Popconfirm title='确认发布模型，请确保该模型还不存在？' okText="确定" cancelText="取消" onConfirm={_ => {
                        let modelId = this.state.currentModelId
                        if(modelId === -1 || this.state.isEdited) {
                            message.warn('请先保存模型')
                        } else {
                            this.setState({modalCreateShareModelShow: true})
                        }
                    }}>
                        <Button type="primary" icon="to-top" >发布模型</Button>
                    </Popconfirm>
                    <Popconfirm title='确认更新模型，请确保模型以存在？' okText="确定" cancelText="取消" onConfirm={_ => {
                        let modelId = this.state.currentModelId
                        if(modelId === -1 || this.state.isEdited) {
                            message.warn('请先保存模型')
                        } else {
                            coreUpdateShareModel(modelId, this.state.currentFileName)
                        }
                    }}>
                        <Button type="primary" icon="upload" >更新模型</Button>
                    </Popconfirm>

                    <Popconfirm title='确认全部执行？' okText="确定" cancelText="取消" onConfirm={_ => {
                        coreExecModel(this)
                    }}>
                        <Button type="primary" icon="hourglass" >全部执行</Button>
                    </Popconfirm>
                    <Popconfirm title='确认移除所有组件？' okText="确定" cancelText="取消" onConfirm={_ => {
                        removeAll()
                        this.renderD3()
                        this.save()
                    }}>
                        <Button type="primary" icon="close">移除所有组件</Button>
                    </Popconfirm>
                    
                </ButtonGroup>
                <div
                    style={{color:'#fff', float:'right', paddingRight:'1%'}}>
                    <span style={{color:'red'}}>{this.state.isEdited ? '已编辑' : '已保存'}</span>
                    <span style={{color:'#aaa',fontSize:'0.8em', margin:'0px 4px'}}>上次保存时间：{this.state.lastSaveTime}</span>
                    <span>{this.state.currentFileName}</span>
                </div>
              </Header>
              <Content>
                    <div className='model-edit-resize-box'>
                        <div style={{width:this.state.defaultEditorPanelWidth}} className={'model-edit-editor out-container'} ref={d => this.domOutContainer = d} >
                            <svg onMouseEnter={this.enterWork} onMouseLeave={this.outWork} className='work-bench work-bench-back' width="1000" height="1000"
                            style={{cursor:this.state.WorkMove?'move':'default'}}>
                                <defs>
                                    <filter id="svg-shadow-2px">
                                        <feColorMatrix result="matrixOut" in="SourceGraphic" type="matrix"
                                            values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0" />
                                        <feGaussianBlur
                                        in="matrixOut"
                                        stdDeviation="2" result="blurOut" />
                                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                                    </filter>
                                </defs>
                            </svg>
                        </div>
                        <div className='model-edit-move-line' 
                        style={{right:this.state.defaultAttrPanelWidth}} 
                        ref={d => this.domResizeLine = d}>
                        <div className={this.state.isRightTogglet ? 'right-toggle- right-toggle-show' : 'right-toggle- right-toggle'} >
                        <div className='point-to-left' />
                        </div>
                        </div>
                        
                        
                        <div className='model-edit-attrs' style={{width:this.state.defaultAttrPanelWidth}}>
                        {this.state.currentSelectedNodeConf ? <Collapse activeKey={this.state.attrActivePanel} onChange={value => {
                            if(value.indexOf('4') === -1) {
                                value.push('4')
                            }
                            this.setState({attrActivePanel: value})
                        }}>
                            <Panel header="字段过滤设置" key="1">
                            <ModelColumnFilter updateFlag={this.state.updateFlag} data={tableFilter} searchSource={dbFileds}
                            onSave={this.attrSaveFilters} onClear={this.attrClearFilters} />
                            </Panel>
                            <Panel header={(this.state.currentSelectedNode ? this.state.currentSelectedNode : '选中')+ '表的字段信息'} key="2">
                            <ColumnsShow data={dbColumns} />
                            </Panel>
                            <Panel style={{padding:'0 2px'}} header={<div className='model-edit-title'>模型编辑<i className='h-hold'/><Popover placement='topRight' content={<div><div>DatasSource:对应数据表实体</div><div>Calc:对应计算节点</div><div>Union:对应数据流合并节点</div></div>} title="模型类型"><Icon type="info-circle-o" style={{lineHeight:'22px', paddingRight: 4}} /></Popover></div>} key="3">
                            <ModelInfoEditor changeName={value => {
                                if(this.state.currentSelectedNodeConf) {
                                    this.state.currentSelectedNodeConf.text = value
                                    this.renderD3()
                                    this.save()
                                    return true
                                }
                            }} conf={this.state.currentSelectedNodeConf} />
                            </Panel>
                            <Panel header="执行结果" header={<div className='model-edit-title'>执行结果显示<i className='h-hold'/><Button onClick={_ => true} type='primary' style={{marginRight:6}} size='small' onClick={_ => coreExecModelPart(this)}>执行选中模型</Button><Popover placement='topRight' content={<div><div>这里显示模型运行产生的最终结果</div></div>} title="运行结果"><Icon type="info-circle-o" style={{lineHeight:'22px', paddingRight: 4}} /></Popover></div>} key="4">
                            <ModelExecResult conf={this.state.currentSelectedNodeConf} execResult={currentExecResult}/>
                            </Panel>
                        </Collapse> : <div className='select-empty-hold'>选中模型进行编辑</div>}
                        </div>
                    </div>
                </Content>
            </Layout>
          </Layout>

          <Modals.ModalRenameModel cancel={_ => this.setState({modalRenameShow:false})} modalShow={this.state.modalRenameShow} ok={newName => {
              coreUpdateModelName(this, this.state.currentFileName, newName).then(ok => {
                  if(ok) {
                    this.setState({modalRenameShow:false, currentFileName:newName})
                  } else {
                      this.setState({modalRenameShow: false})
                  }
              })
          }} />
          <Modals.ModalCreateShareModel cancel={_ => this.setState({modalCreateShareModelShow: false})} modalShow={this.state.modalCreateShareModelShow} ok={(intro, type) => {
                coreCreateShare(this.state.currentModelId, this.state.currentFileName, intro, type).then(_ => {
                    this.setState({modalCreateShareModelShow: false})
                })
          }} />
          </div>
          )
    }

    componentDidMount() {
        this.initD3()
        this.renderD3()
        initEvent(this, this.domOutContainer)
        /*
        d3.xml('http://mac:3000/svg/unionAll.svg', {type:"image/svg+xml"}).then(xml => {
            console.log(xml)
        })
        */
        let {httpData_UserModelData, listUserModel, httpData_TopicTreeData, listTree} = this.props
        if(httpData_UserModelData.code !== 0) {
            listUserModel()
        } else {
            if(httpData_UserModelData.data.length > 0) {
                let data = httpData_UserModelData.data[0]
                initDatas(this, data)
            } else {
            }
        }
        if(httpData_TopicTreeData.code !== 0) {
            listTree()
        }
    }

    // 新建编辑模型， 清空用户的编辑数据
    resetUserData = () => {
        let {httpData_UserModelData, listUserModel, clearUserModel} = this.props
        clearUserModel()
        AFetchJSON(Apis.model.reset).then(json => {
            if(json.code === 0) {
                message.info('删除当前编辑数据成功')
                resetDatas(this)
            } else {
            }
        })
    }

    initD3 = () => {
        let svg = d3.select(".work-bench")
        svg.append("g")
        .attr("class", "links")
        svg.append("g")
        .attr("class", "nodes")
        svg.append("g")
        .attr("class", "labels")
        svg.append("g")
        .attr("class", "union-nodes")

    }

    renderD3 = () => {
        let svg = d3.select(".work-bench")
        hock.workBench = svg
            
        let Link = svg.selectAll('.links')
        .selectAll("path")
        .data(getLinks())
        CreateLink(Link)

        let Label = svg.selectAll('.labels')
        .selectAll("g")
        .data(getLinkCenter())
        CreateLabel(Label)

        let NODE = svg.selectAll('.nodes')
        .selectAll('svg')
        .data(getDatas())
        CreateNode(this, NODE)

        let UNION_NODED = svg.selectAll('.union-nodes')
        .selectAll('svg')
        .data(getUnionDatas())
        CreateUnionNode(this,UNION_NODED)
    }

    // 在建模树上使用
    handleMouseEnter = (e, type, record) => {
        hock.isInDragArea = true
        hock.toggleSourceData = record
        this.ModelType = type
        this.setState({cursor:'move', isDragg:true});
    }
    handleMouseOut = (e) => {
        hock.isInDragArea = false
        this.ToogleIsDown
        this.setState({cursor:'pointer'});
    }
    handleMouseDown = (e) => {
        if(this.state.isDragg && hock.isInDragArea) {
            let TypeC = DataType[this.ModelType]
            if(TypeC) {
                this.moveModel = Create().Shotcut(d3.select('.shot-container'), {x:e.pageX, y:e.pageY}, this.ModelType, TypeC)
                this.posc = {x:this.moveModel.attr('x'), y:this.moveModel.attr('y')}
            }
        }
    }
    handleMouseMove = (e) => {
        if(this.state.isDragg === true && this.moveModel){
            updatePosition(this.moveModel, {x:e.pageX, y:e.pageY})
            this.posc = {x:this.moveModel.attr('x'), y:this.moveModel.attr('y')}
            // const moveX = e.pageX - this.state.clientx;
            // const moveY = e.pageY - this.state.clienty;
        } else {
            return false;
        }
    }
    handleMouseUp = (e) => {
        e.preventDefault();
        let typeC
        if(this.moveModel) {
            typeC = DataType[this.moveModel.attr('type')]
            this.moveModel.remove()
            this.moveModel = null
        }
        this.setState({
            isDragg:false,
        })
        if(this.canCreate && this.posc && typeC && hock.toggleSourceData) {
            CreateAndRefresh(this, {
                type:'ToggleCreate',
                typeC:typeC,
                data: hock.toggleSourceData
            })
        }
    }
    enterWork = () => {
        this.canCreate = true
    }
    outWork = () => {
        this.canCreate = false
    }

    save = () => {
        coreSave(this)
    }

    attrClearFilters = () => {
        this.setState({tableFilters:{}})
        this.save()
    }
    attrSaveFilters = (tableFilter) => {
        const {tableFilters} = this.state
        tableFilters[this.state.currentSelectedNode] = tableFilter
        this.setState({tableFilters})
        this.save()
    }

    componentWillReceiveProps(nextProps) {
        // 接收到modal数据
        // console.log('rec1')        
        if(nextProps.workConf && nextProps.workConf.type && nextProps.workConf.data && hock.triggerSourceNode) {
            CreateAndRefresh(this, nextProps.workConf)
        } else {
            if(this.state.currentModelId === -1 && !this.state.isEdited) {
                let {httpData_UserModelData} = nextProps
                if(httpData_UserModelData.code === 0 && httpData_UserModelData.data.length > 0) {
                    let data = httpData_UserModelData.data[0]
                    initDatas(this, data)
                }
            } else {
                // console.log('rec2')
            }
        }
    }

    // 变更选中的节点
    changeSelectedNode = (conf) => {
        if(conf.type === 'DataSource' || conf.type === 'Calc') {
            let tableName = conf._workConf.tableName
            if(this.state.currentSelectedNode === tableName) {
                return
            }
            this.props.listColumnInfoByTableName(tableName)
            let refresh = {currentSelectedNode: tableName, currentSelectedNodeConf: conf, isEdited: true, updateFlag: this.state.updateFlag + 1}
            this.setState(refresh)
            if(!this.state.execResult[this.state.currentSelectedNode]) {
                coreExecModelPart(this)
            }
        } else if(conf.type === 'Union') {
            this.setState({currentSelectedNode: null, currentSelectedNodeConf : conf, isEdited: true, updateFlag: this.state.updateFlag + 1})
        }
    }

    // ModeCreate
    onCircleMouseEnterTarget = (d) => {
        const {listColumnInfoByTableName} = this.props
        if(hock.triggerPath) {
            let source = hock.triggerPath.attr('source')
            // let lineData = source > target ? {source:source, target:target} : {source:target, target:source}
            let lineData = {source:source, target:d.id}
            checkRule(this, getDatas(), getLinks(), lineData, _ => {
                setCanDrag(true)
                hock.triggerPath.remove()
                hock.triggerPath = null
            }, _ => {
                let sD = getNodeDataById(source)
                if(sD.type === 'DataSource' && d.type === 'DataSource') {
                    hock.triggerTargetNode = d
                    listColumnInfoByTableName(sD._workConf.tableName)
                    listColumnInfoByTableName(d._workConf.tableName)
                    this.setState({visibleAggModal:true})
                } else {
                    addLink(lineData)
                    this.setState({isEdited: true})
                    this.renderD3()
                }
            })
        }
    }
}


function mapStateToProps(state) {
    return {
        httpData_TopicTreeData: state.httpData_TopicTreeData,
        httpData_UserModelData: state.httpData_UserModelData,
        workConf: state.workConf,
        httpData_TableColumnInfo: state.httpData_TableColumnInfo,
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
        listTree: () => dispatch(listTree(dispatch)),
        listUserModel: () => dispatch(listUserModel(dispatch)),
        clearUserModel: () => dispatch({type: 'HTTP_CLEAR_USER_MODEL_DATA'}),
        listColumnInfoByTableName: (tableName, force = false) => dispatch(listColumnInfoByTableName(dispatch, tableName, force))
      // onGetHttp: (page) => dispatch(fg(dispatch, page))
    }
  }

  
export default connect(mapStateToProps, mapDispatchToProps)(ModelEdit) 