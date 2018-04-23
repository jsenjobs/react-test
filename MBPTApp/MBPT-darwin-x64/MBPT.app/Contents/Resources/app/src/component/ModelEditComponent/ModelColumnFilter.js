import React, {Component} from 'react'
import { Table, Icon, Row, Col, Input, Select, Checkbox, Button, AutoComplete } from 'antd'
import {uuid} from '../../utils/UUID'
const InputGroup = Input.Group
const Option = Select.Option
/*
data = {
    1: {
        1: {
            column:'columnName',
            func:'=',
            value:'123'
        },
        2: {
            type: 'and',
            column:'columnName',
            func:'=',
            value:'123'
        },
        3: {
            type: 'or',
            column:'columnName',
            func:'=',
            value:'123'
        },
        4: {
            type: 'or',
            1: {
                column:'columnName',
                func:'=',
                value:'123'
            },
            2: {
                type: 'and',
                column:'columnName',
                func:'=',
                value:'123'
            },
            3: {
                type: 'or',
                column:'columnName',
                func:'=',
                value:'123'
            }
        }
    },
    2: {
        1: {
            column:'columnName',
            func:'=',
            value:'123'
        },
        2: {
            type: 'and',
            column:'columnName',
            func:'=',
            value:'123'
        },
        3: {
            type: 'or',
            column:'columnName',
            func:'=',
            value:'123'
        }

    }
}
*/

// let index = 0
function genName() {
    return uuid() // 'Ft-' + (index++)
}
class EditGroup extends Component {
    render() {
        const {checked, selected, data, searchSource, onFuncChange, onGroupChange, onPlus, onMinus, onEditLeft, onEditRight, _uuid, _index, _txtLeft, _txtRight, _txtLeftChange, _txtRightChange} = this.props
        let len = data.length - 1
        const opts = searchSource.map(v => <Option value={v}>{v}</Option>)
        let funOpts = []
        if(checked) {
            funOpts.push(<Option value="and">和</Option>)
            funOpts.push(<Option value="or">或</Option>)
        } else {
            funOpts.push(<Option value="eq">=</Option>)
            funOpts.push(<Option value="gt">&gt;</Option>)
            funOpts.push(<Option value="lt">&lt;</Option>)
            funOpts.push(<Option value="gteq">&gt;=</Option>)
            funOpts.push(<Option value="lteq">&lt;=</Option>)
            funOpts.push(<Option value="noteq">!=</Option>)
        }
        return <InputGroup size="small">
            <Col style={{textAlign:'right'}} span='6'>
            <Checkbox size='small' checked={checked} onChange={onGroupChange}>设为组</Checkbox>
            <Button.Group size='small'>
                {(len === _index) ? 
                <Button onClick={_ => onPlus(_uuid)} size='small' type="primary">
                    <Icon type="plus" />
                </Button> : null
                }
                {data.length > 1 ? 
                <Button onClick={_ => onMinus(_uuid)} size='small' type="primary">
                    <Icon type="minus" />
                </Button> : null }
                
            </Button.Group>
            </Col>
            <Col span="7">
                {checked ? <Button size='small' style={{width:'100%'}} onClick={_ => onEditLeft(_uuid)}>编辑左组</Button>:
                <Select
                style={{width:'100%'}}
                showSearch
                size='small'
                onChange={value => _txtLeftChange(_uuid, value)}
                value={_txtLeft}
                placeholder='选择一个字段'
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                optionFilterProp="children"
                >{opts}</Select>
                /*<AutoComplete dataSource={searchSource} onChange={value => _txtLeftChange(_uuid, value)} value={_txtLeft} size="small" placeholder='输入字段名-1' />*/}
            </Col>
            <Col span={4}>
            <Select
                size='small'
                value={selected}
                showSearch
                onChange={onFuncChange}
                style={{ width: '100%' }}
                placeholder="选择操作"
            >
            {funOpts}
            </Select>
            </Col>
            <Col span="7">
                {checked ? <Button size='small' style={{width:'100%'}} onClick={_ => onEditRight(_uuid)}>编辑右组</Button>:<Input onChange={e => _txtRightChange(_uuid, e.target.value)} value={_txtRight} size="small" placeholder='输入值' />}
            </Col>
        </InputGroup>
    }

}

function BuildPathIndex(props) {
    let cs = props.path.split('/')
    let nodes = cs.map(item => {
        if(item !== '') {
            return <span style={{cursor:'pointer'}} onClick={_ => props.onClick(item)}>/{item}</span>
        }
    })
    return <div style={{padding:'0 6px 0 6px', color: '#f00', fontSize: 8}}>{nodes}</div>
}
class ModelColumnFilter extends Component {
    state = {
        data:[],
        currentPath: '',
        isRoot: true,
        isLeft: [],
        updateFlag: 0,
    }
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(newProps) {
        if(newProps.data && newProps.updateFlag > this.state.updateFlag) {
            if(newProps.data.length === 0) {
                this.setState({data:[{
                    uuid:genName(),
                    isGroup:false,
                    left:'',
                    right:'',
                    _left:[],
                    _right:[],
                    func:'eq',
                }], currentPath:'',isRoot:true, isLeft:[], updateFlag: newProps.updateFlag})
            } else {
                this.setState({data:newProps.data, currentPath:'',isRoot:true, isLeft:[], updateFlag: newProps.updateFlag})
            }
        }
    }

    componentDidMount() {
        const {data, updateFlag} = this.props
        if(data && data.length > 0) {
            this.setState({data: data, updateFlag: updateFlag})
        } else {
            this.setState({data:[{
                uuid:genName(),
                isGroup:false,
                left:'',
                right:'',
                _left:[],
                _right:[],
                func:'eq',
            }], currentPath:'',isRoot:true, isLeft:[], updateFlag: updateFlag})
        }
    }

    render() {
        let searchSource = this.props.searchSource
        const root = this.state.data
        const data = this.routerData(root)
        const nodes = data.map((item, index) => {
            return <div>
                <EditGroup checked={item.isGroup} 
                    selected={item.func} 
                    data={data} 
                    _uuid={item.uuid}
                    _index={index}
                    _txtLeft={item.left}
                    _txtRight={item.right}
                    _txtLeftChange={this.onTxtLeftChange}
                    _txtRightChange={this.onTxtRightChange}
                    onFuncChange={selected => this.onFuncChange(item.uuid, selected)}
                    onGroupChange={e => this.onGroupChange(item.uuid, e.target.checked)}
                    onPlus={this.addRow}
                    onMinus={this.delRow}
                    onEditLeft={this.onEditLeft}
                    onEditRight={this.onEditRight}
                    searchSource={searchSource}
                />
                </div>
        })

        return <div> 
            <BuildPathIndex path={this.state.currentPath} onClick={this.goPath} />
            {nodes}
            <Row gutter={16} style={{padding:'6px 16px 6px 16px'}}>
                <Col span='12'><Button style={{width:'100%'}} onClick={_ => this.props.onSave(this.state.data)} type='primary' size='small'>保存</Button></Col>
                <Col span='12'><Button style={{width:'100%'}} onClick={this.clear} type='default' size='small'>清除</Button></Col>
            </Row>
        </div>
    }
    clear = () => {
        const data = [this.buildData()]
        this.setState({data})
        if(this.props.onClear) this.props.onClear()
    }
    onTxtLeftChange = (uuid, txt) => {
        const root = this.state.data
        const data = this.routerData(root)
        data.forEach(item => {
            if(item.uuid === uuid) {
                item.left =  txt
                this.setState({data: root})
                return
            }
        })
    }
    onTxtRightChange = (uuid, txt) => {
        const root = this.state.data
        const data = this.routerData(root)
        data.forEach(item => {
            if(item.uuid === uuid) {
                item.right = txt 
                this.setState({data: root})
                return
            }
        })
    }
    onFuncChange = (uuid, func) => {
        const root = this.state.data
        const data = this.routerData(root)
        data.forEach(item => {
            if(item.uuid === uuid) {
                item.func = func
                this.setState({data: root})
                return
            }
        })
    }
    onGroupChange = (uuid, isGroup) => {
        const root = this.state.data
        const data = this.routerData(root)
        data.forEach(item => {
            if(item.uuid === uuid) {
                item.isGroup = isGroup
                if(isGroup) {
                    if(item._left.length === 0) {
                        item._left.push(this.buildData())
                    }
                    if(item._right.length === 0) {
                        item._right.push(this.buildData())
                    }
                    let is = item._func
                    item._func = item.func
                    if(is) {
                        item.func = is
                    } else {
                        item.func = 'and'
                    }
                } else {
                    let is = item._func
                    item._func = item.func
                    if(is) {
                        item.func = is
                    } else {
                        item.func = 'eq'
                    }
                }
                this.setState({data: root})
                return
            }
        })
    }
    onEditLeft = (uuid) => {
        const {currentPath, isLeft} = this.state
        isLeft.push(true)
        this.setState({currentPath: `${currentPath}/${uuid}`, isLeft:isLeft, isRoot: false})
    }
    onEditRight = (uuid) => {
        const {currentPath, isLeft} = this.state
        isLeft.push(false)
        this.setState({currentPath: `${currentPath}/${uuid}`, isLeft:isLeft, isRoot: false})
    }
    addRow = (uid = '-1') => {
        const root = this.state.data
        const data = this.routerData(root)
        
        let id = -1
        data.forEach((item, index) => {
            if(item.uuid === uid) {
                id = index
            }
        })
        if(id >= 0) {
            data.splice(id, 0, {
                uuid:genName(),
                isGroup:false,
                left:'',
                right:'',
                _left:[],
                _right:[],
                func:'eq',
            })
        } else {
            data.push({
                uuid:genName(),
                isGroup:false,
                left:'',
                right:'',
                _left:[],
                _right:[],
                func:'eq',
            })
        }
        this.setState({data: root})
    }

    delRow = (uuid) => {
        const root = this.state.data
        const data = this.routerData(root)
        data.forEach((item, index) => {
            if(item.uuid === uuid) {
                data.splice(index, 1)
                this.setState({data: root})
                return
            }
        })
    }

    goPath = (key) => {
        if(key === 'root') {
            this.setState({currentPath: '', isLeft:[], isRoot: true})
        } else {
            let cs = this.state.currentPath.split('/')
            const {isLeft} = this.state
            for(let i = cs.length - 1; i >= 0; i--) {
                if(cs[i] !== key) {
                    isLeft.pop()
                } else {
                    isLeft.pop()
                    break
                }
            }
            let path = ''
            for(let i = 0; i < cs.length; i++) {
                let c = cs[i]
                if(c === key) {
                    break
                }
                if(c !== '') {
                    path += `/${cs[i]}`
                }
            }
            this.setState({currentPath: path, isLeft:isLeft, isRoot: false})
        }
    }
    
    buildData() {
        return {
            uuid:genName(),
            isGroup:false,
            left:'',
            right:'',
            _left:[],
            _right:[],
            func:'eq',
        }
    }

    routerData = (data) => {
        const {currentPath} = this.state
        if(currentPath === '') return data
        let cs = currentPath.split('/')
        return this.loopSearch(data, data, cs, 1)
    }

    loopSearch = (root, data, cs, index) => {
        if(cs.length === index) {
            return data
        }
        let uuid = cs[index]
        let newData = this.searchDataItem(data, uuid, this.state.isLeft[index - 1])
        return this.loopSearch(root, newData, cs, index + 1)
    }
    searchDataItem = (data, uuid, isLeft) => {
        let result = null
        data.forEach(d => {
            if(d.uuid === uuid) {
                result = d
            }
        })
        if(this.state.isRoot) {
            return result
        } else if(isLeft) {
            return result._left
        } else {
            return result._right
        }
    }

    getIsLeft = () => {
        const {isLeft} = this.state
        return isLeft.length > 0 &&  isLeft[isLeft.length - 1]
    }
}


export default ModelColumnFilter