
import React, {Component} from 'react'
import { Tree, Icon} from 'antd'
import logo from '../../logo.png';
const {TreeNode} = Tree

var DataTree = {}
export function createTree(target) {
    let treeData = target.props.httpData_TopicTreeData.data
    treeData = treeData ? treeData : []
    function build(data, type='topic') {
        const nodes = data.map(d => {
            if(d._tables) {
                if(d._tables.length > 0) {
                    const subs = build(d._tables, 'table')
                    return (<TreeNode id={d.id} title={<span><Icon style={{marginRight:4}} type="skin" />{d.name}</span>} key={'sub-topic-' + d.id}>{subs}</TreeNode>)
                } else {
                    return (<TreeNode disabled isLeaf id={d.id} title={<span><Icon style={{marginRight:4}} type="skin" />{d.name}</span>} key={'sub-topic-' + d.id} />)
                }
                //const subs = build(d._tables, 'table')
                //return (<TreeNode icon={<Icon type="smile-o" />} title={d.name} key={'topic-' + d.id}>{subs}</TreeNode>)
            } else if(d._children) {
                const subs = build(d._children)
                return (<TreeNode id={d.id} title={<span><Icon style={{marginRight:4}} type="skin" />{d.name}</span>} key={'topic-' + d.id}>{subs}</TreeNode>)
            } else {
                if(type === 'topic')
                    return (<TreeNode disabled isLeaf id={d.id} title={<span><Icon style={{marginRight:4}} type="skin" />{d.name}</span>} key={'topic-' + d.id} />)
                return (<TreeNode isLeaf id={d.id} title={<span class={'tree-table'} style={{ color: '#1890ff' }} style={{'cursor':target.state.cursor}} onMouseEnter ={e => target.handleMouseEnter(e, 'DataSource', d)} onMouseOut={target.handleMouseOut}><Icon style={{marginRight:4}} type="api" />{d.metaName}</span>} key={'table-' + d.id} />)
            }
        })
        return nodes
    }
    function onSelect(selectedKeys, e) {
        let key = e.node.props.eventKey
        console.log(e)
        if(key.substring(0, 6) === 'table-' || e.node.props.isLeaf) {
            return
        }
        let sub = key.substring(0, 6)
        let data = target.state.treeExpandNodes
        if(e.selected) {
            target.setState({treeExpandNodes:[...data, key]})
        } else {
            target.setState({treeExpandNodes: data.filter(d => d != key)})
        }
    }
    return (<Tree
        multiple
        autoExpandParent={false}
        expandedKeys={target.state.treeExpandNodes}
        selectedKeys={target.state.treeExpandNodes}
        onExpand={(expandedKeys, e)=>{
            console.log(expandedKeys)
            console.log('set0')
            
            target.setState({treeExpandNodes:expandedKeys})
        }}
        onSelect={onSelect}>
        <div className='logo' >
            <img src={logo} className="App-logo small" alt="logo" />
        </div>
            <TreeNode title="主题" key="-topic">
                {build(treeData)}
            </TreeNode>
            <TreeNode title="分析池" key="-ana">
                <TreeNode title={<span style={{ color: '#1890ff' }} style={{'cursor':target.state.cursor}} onMouseEnter ={e => target.handleMouseEnter(e, 'DataSource')} onMouseOut={target.handleMouseOut}>ana-1</span>} key="0-0-1-0" />
                <TreeNode title="leafleafleafleafleafleaf4" key="0-0-1-1" />
            </TreeNode>
            <TreeNode title="临时结果" key="-cache">
                <TreeNode title="lea5f" key="0-0-2-0" />
                <TreeNode title="leaf6" key="0-0-2-1" />
            </TreeNode>
        </Tree>)
}