import React, {Component} from 'react'
import { Row, Col, Menu, Dropdown, Icon, Input, Button, AutoComplete, Table, message, Modal, Checkbox} from 'antd';
import './ResourceSearch.less'
import {connect} from 'react-redux'
import { listTree } from '../Redux/PromiseTask/Topic'
import Apis from '../Api/Apis'
import {AFetchJSON} from '../utils/AFetch'
import ButtonGroup from 'antd/lib/button/button-group';
const SubMenu = Menu.SubMenu;
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

function handleData(data, handle) {
    const filterData = {
        table:[],
        topic:[],
        subTopic:[],
    }
    let menuData = data.map(d => {
        if(d._children && d._children.length > 0) {
            let subMenuData = d._children.map(subD => {
                if(subD._tables && subD._tables.length > 0) {
                    let tableData = subD._tables.map(table => {
                        let name = table.tableName
                        if(name && filterData.table.indexOf(name) === -1) {
                            filterData.table.push({name:name, key:`/${d.name}/${subD.name}/${table.tableName}`})
                        }
                        return <Menu.Item className='resource-search-drop-down-ul' key={`/${d.name}/${subD.name}/${table.tableName}`}><Icon type="folder" /> {`${table.metaName}(${table.tableName})`}</Menu.Item>
                    })
                    let name = subD.name
                    if(name && filterData.subTopic.indexOf(name) === -1) {
                        filterData.subTopic.push({name, key:`/${d.name}/${subD.name}`})
                    }
                    return <SubMenu className='resource-search-drop-down-ul' key={`/${d.name}/${subD.name}`} onTitleClick={e => handle(e.key)} title={<span className='sub-title'><Icon type='line-chart' /><span> {subD.name}</span></span>}>{tableData}</SubMenu>
                } else {
                    let name = subD.name
                    if(name && filterData.subTopic.indexOf(name) === -1) {
                        filterData.subTopic.push({name, key:`/${d.name}/${subD.name}`})
                    }
                    return  <Menu.Item className='resource-search-drop-down-ul' key={`/${d.name}/${subD.name}`}><Icon type="line-chart" /> {subD.name}</Menu.Item>
                }
            })
            let name = d.name
            if(name && filterData.topic.indexOf(name) === -1) {
                filterData.topic.push({name, key:`/${d.name}`})
            }
            return <SubMenu className='resource-search-drop-down-ul' key={`/${d.name}`} onTitleClick={(e, d) => handle(e.key)} title={<span className='sub-title'><Icon type='pie-chart' /><span> {d.name}</span></span>}>{subMenuData}</SubMenu>
        } else {
            let name =  d.name
            if(name && filterData.topic.indexOf(name) === -1) {
                filterData.topic.push({name, key:`/${d.name}`})
            }
            return <Menu.Item className='resource-search-drop-down-ul' key={`/${d.name}`}><Icon type="pie-chart" /> {d.name}</Menu.Item>
        }
    })
    const fD = [
        {
            title:'表',
            children: filterData.table
        },
        {
            title:'子主题',
            children: filterData.subTopic
        },
        {
            title:'主题',
            children: filterData.topic
        },
    ]
    const options = fD.map(group =>
        <OptGroup
          key={group.title}
          label={group.title}
        >
          {group.children.map(opt =>
            <Option key={opt.key} value={opt.key}>
              {opt.key}
            </Option>)
          }
        </OptGroup>)


    return {
        drop: <Menu className='resource-search-drop-down-ul' onClick={e => handle(e.key)}>{menuData}</Menu>,
        data: options
    }
}

function isEmptyObj(obj) {
    for(let k in obj) {
        return false
    }
    return true
}
class CreateFilterResult extends Component {
    state = {
        showModal: false,
        filterModal: false,
        columnShowChecked: {}, // 字段过滤标志
        columnFilterChecked: {}, // 字段显示标志
        columnFilterCheckValue: {},
        updateFlag: -1,
    }
    constructor(props) {
        super(props)
    }
    componentWillReceiveProps(newProps) {
        const {tableDatas} = newProps
        // tableDatas.length > 0 && (this.props.filterData !== newProps.filterData || isEmptyObj(this.state.columnShowChecked)))
        if(tableDatas.length > 0 && (this.props.filterData !== newProps.filterData || isEmptyObj(this.state.columnFilterChecked))) {
            let column = tableDatas[0]
            let columnFilterChecked = {}
            let columnFilterCheckValue = {}
            for(let key in column) {
                columnFilterChecked[key] = false
                columnFilterCheckValue[key] = ''
            }
            this.setState({columnFilterChecked, columnFilterCheckValue})
        }
        if(tableDatas.length > 0 && (this.state.updateFlag < newProps.updateFlag || isEmptyObj(this.state.columnShowChecked))) {
            let column = tableDatas[0]
            let cIs = this.state.columnShowChecked
            let columnShowChecked = {}
            for(let key in column) {
                if(cIs[key] === undefined) {
                    columnShowChecked[key] = true
                } else {
                    columnShowChecked[key] = cIs[key]
                }
            }
            this.setState({columnShowChecked, updateFlag: newProps.updateFlag})
        }
    }
    render() {
        const {filterData, filterPath, deep, tableDatas, fetchTableDatas, tableName} = this.props
        if(filterPath.length === 0) return null

        let tableShow = null
        if(tableDatas.length > 0) {
            let column = tableDatas[0]
            let columnShowChecked = this.state.columnShowChecked

            let cConf = []
            for(let key in column) {
                if(columnShowChecked[key]) {
                    cConf.push({
                        title: key,
                        dataIndex: key,
                    })
                }
            }
            const modalDatas = []
            const filerModalData = []
            for(let key in this.state.columnShowChecked) {
                modalDatas.push(<Checkbox checked={this.state.columnShowChecked[key]} onChange={e => {
                    let columnShowChecked = this.state.columnShowChecked
                    columnShowChecked[key] = e.target.checked
                    this.setState({columnShowChecked})
                }} >{key}</Checkbox>)
            }
            for(let key in this.state.columnFilterChecked) {
                filerModalData.push(<Row className='modal-column-filter-row'><Col span='8'><Checkbox checked={this.state.columnFilterChecked[key]} onChange={e => {
                    let columnFilterChecked = this.state.columnFilterChecked
                    columnFilterChecked[key] = e.target.checked
                    this.setState({columnFilterChecked})
                }} >{key}</Checkbox></Col><Col span='16'>{this.state.columnFilterChecked[key] ? <Input value={this.state.columnFilterCheckValue[key]} onChange={e => {
                    let columnFilterCheckValue = this.state.columnFilterCheckValue
                    columnFilterCheckValue[key] = e.target.value
                    this.setState({columnFilterCheckValue})
                }} size='small' placeholder='请输入值' /> : null }</Col></Row>)
            }
            tableShow = <div>
            <Modal title="过滤特殊字段" visible={this.state.filterModal}
                onOk={this.filterColumnChange} onCancel={_ => this.setState({filterModal: false})}
                >
                {filerModalData}
            </Modal>
            <Modal title="字段显示设置" visible={this.state.showModal}
                onOk={_ => this.setState({showModal: false})} onCancel={_ => this.setState({showModal: false})}
                >
                {modalDatas}
            </Modal>
                <Table size='small' pagination={false} dataSource={tableDatas} columns={cConf}
                title={_ => {
                    return <div>
                        <Row>
                            <Col span='12' style={{marginBottom:6}}>
                                {tableName}表的数据
                            </Col>
                            <Col span='12' >
                                <ButtonGroup size='small' style={{float:'right'}}>
                                    <Button type='primary' size='small' onClick={_ => this.setState({showModal:true})}>设置显示的字段</Button>
                                    <Button type='primary' size='small' onClick={_ => this.setState({filterModal:true})}>过滤特殊字段</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                }}
                />
            </div>
        }
        if(deep === 3) {
            // 选中数据表

            if(tableShow) {
                return <div>
                        <div className='all-tables-title' style={{marginBottom: 6, borderRadius: 4}}>选中{filterData}数据表</div>
                        {tableShow}
                    </div>
            } else {
                return <div>
                        <div className='all-tables-title' style={{marginBottom: 6, borderRadius: 4}}>选中{filterData}数据表</div>
                        <div>没有数据显示</div>
                    </div>
            }
        } else if(deep === 2) {
            const content = filterData.map(item => {
                return <p onClick={_ => fetchTableDatas(item.tableName)} style={{float:'left', cursor: 'pointer', padding:6}} key={item.tableName}>{item.tableName}</p>
            })
            return <div>
                    <div className='all-tables-out'>
                        <div className='all-tables-title'>{filterPath}</div>
                        <div className='all-tables-container'>{content}</div>
                    </div>
                    {tableShow}
                </div>
        } else if(deep === 1) {
            const content = filterData.map(item => {
                const tables = (item._tables && item._tables.length > 0) ? item._tables.map(table =>
                     <p onClick={_ => fetchTableDatas(table.tableName)} className='all-tables-p' style={{float:'left', cursor: 'pointer', padding:'0 6px'}} key={table.tableName}>{table.tableName}</p>) : <p>没有表</p>
                return <div className='all-tables-out'>
                    <div className='all-tables-title'>{`${filterPath}/${item.name}`}</div>
                    <div className='all-tables-container'>{tables}</div>
                    </div>
            })
            return <div>
                <div className='all-tables-title' style={{marginBottom: 6, borderRadius: 4}}>{`${filterPath}`}</div>
                {content}
                {tableShow}
                </div>
        }
        return null

    }

    filterColumnChange = () => {
        const {columnFilterChecked, columnFilterCheckValue} = this.state
        let query = ''
        for(let key in columnFilterChecked) {
            if(columnFilterChecked[key] && columnFilterCheckValue[key]) {
                query += `${key}='${columnFilterCheckValue[key]}',`
            }
        }
        // column = column.substring(0, column.length - 1)
        query = query.trim()
        if(query.length > 0) {
            query = query.substring(0, query.length - 1)
        }
        this.props.onColumnChanged(query)
        this.setState({filterModal: false})
    }
}

class ResourceSearch extends Component {
    state = {
        dropVisible: false, // 控制drop的显示
        searchValue:'', // 搜索框的值
        filterPath: '', // 当前选中路径
        filterData: [], // 当前选中路径下的数据（tree），如果选中table则是tableName）
        deep: 0, // 1，2，3 一为主题 三为table

        tableDatas: [],
        tableName: '', // 当前选中的table 名字

        updateFlag:0,
    }
    constructor(props) {
        super(props)
        this.query = ''
    }
    componentDidMount() {
        let {httpData_TopicTreeData, listTree} = this.props
        if(httpData_TopicTreeData.code !== 0) {
            listTree()
        }
    }
    render() {
        let data = this.props.httpData_TopicTreeData.data
        data = data ? data : []
        let handleD = handleData(data, this.onItemSelected)
        return (<div className='resource-search'>
            <AutoComplete
            style={{width:'100%'}}
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            dataSource={handleD.data}
            value={this.state.searchValue}
            onChange={searchValue => this.setState({searchValue})}
            >
            <Input placeholder="搜索资源 主题 数据表" style={{borderRadius: 16, padding:'4px 18px'}} onPressEnter={_ => this.onItemSelected(this.state.searchValue)} />
            </AutoComplete>
            <Dropdown placement="bottomLeft" overlay={handleD.drop} visible={this.state.dropVisible} onVisibleChange={v => this.setState({dropVisible:v})}>
                <Button className='drop-down-button' icon='search' type='dashed'>查找主题</Button>
            </Dropdown>
            <CreateFilterResult
                onColumnChanged={this.onColumnChanged} 
                updateFlag={this.state.updateFlag} 
                tableDatas={this.state.tableDatas}
                filterPath={this.state.filterPath} 
                filterData={this.state.filterData} 
                deep={this.state.deep} 
                fetchTableDatas={this.fetchTableDatas}
                tableName={this.state.tableName}
             />
            
        </div>)
    }
    
    onItemSelected = (path) => {
        let splits = path.split('/')
        let data = this.props.httpData_TopicTreeData.data
        data = data ? data : []
        let len = splits.length
        let find = false
        if(len === 2) {
            let currentKey = splits[1]
            find = false
            data.forEach(item => {
                if(item.name === currentKey) {
                    find = true
                    data = item._children
                }
            })
            if(find) {
                this.setState({
                    dropVisible: false,
                    tableDatas: [],
                    filterPath: path, 
                    filterData: data ? data : [], 
                    deep: 1
                })
            }
        } else if(len === 3) {
            let currentKey = splits[1]
            find = false
            data.forEach(item => {
                if(item.name === currentKey) {
                    find = true
                    data = item._children
                }
            })
            if(!find || !data) return
            currentKey = splits[2]
            find = false
            data.forEach(item => {
                if(item.name === currentKey) {
                    find = true
                    data = item._tables
                }
            })
            if(find) {
                this.setState({
                    dropVisible: false,
                    tableDatas: [],
                    filterPath: path, 
                    filterData: data ? data : [],
                    deep: 2
                })
            }
        } else if(len === 4) {
            let currentKey = splits[1]
            find = false
            data.forEach(item => {
                if(item.name === currentKey) {
                    find = true
                    data = item._children
                }
            })
            if(!find || !data) return
            currentKey = splits[2]
            find = false
            data.forEach(item => {
                if(item.name === currentKey) {
                    find = true
                    data = item._tables
                }
            })
            if(!find || !data) return
            currentKey = splits[3]
            find = false
            data.forEach(item => {
                if(item.tableName === currentKey) {
                    find = true
                    data = item.tableName
                }
            })
            //         const {filterData, filterPath, deep, tableDatas} = this.props

            if(find) {
                this.query = ''
                // fetch data
                AFetchJSON(Apis.task.pre.listTableData + data + '/0/20?query=' + this.query).then(json => {
                    if(json.code === 0) {
                        message.success(`获取数据表${data}数据成功`)
                        this.setState({
                            dropVisible: false,
                            tableDatas: json.data,
                            filterPath: path,
                            filterData: data ? data : [],
                            deep: 3,
                            tableName: data,
                            updateFlag: this.state.updateFlag+1
                        })
                    } else {
                        message.warn(`获取数据表${data}数据失败：${json.msg}`)
                    }
                })
            }

        }
    }

    fetchTableDatas = (tableName) => {
        this.query = ''
        this.tableName = tableName
        // fetch data
        AFetchJSON(Apis.task.pre.listTableData + tableName + '/0/20?query=' + this.query).then(json => {
            if(json.code === 0) {
                message.success(`获取数据表${tableName}数据成功`)
                this.setState({
                    tableDatas: json.data,
                    tableName: tableName,
                })
            } else {
                message.warn(`获取数据表${tableName}数据失败：${json.msg}`)
            }
        })
    }

    onColumnChanged = (query) => {
        this.query = query
        // fetch data
        AFetchJSON(Apis.task.pre.listTableData + this.tableName + '/0/20?query=' + this.query).then(json => {
            if(json.code === 0) {
                message.success(`获取数据表${this.tableName}数据成功`)
                this.setState({
                    tableDatas: json.data,
                    updateFlag: this.state.updateFlag+1,
                })
            } else {
                message.warn(`获取数据表${this.tableName}数据失败：${json.msg}`)
            }
        })

    }
}

function mapStateToProps(state) {
    return {
        httpData_TopicTreeData: state.httpData_TopicTreeData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        listTree: () => dispatch(listTree(dispatch)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceSearch)