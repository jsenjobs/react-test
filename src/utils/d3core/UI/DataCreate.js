import DataType from '../ModelTypes'
import {getTransformXY} from './Utils'
import {addData, addUnionData, addLink} from '../ModelConf'
import {checkNodePosition} from './AreaChecker'
import {uuid, uuidStr} from '../../UUID'
import {execModelPartQuick} from '../Exec/ModelExec'
const map = {
    AggJoin:'内连接',
    LeftJoin:'左连接',
    FullJoin:'全连接',
    LeftExclude:'左排除',
    DistinctUnion:'去重合并',
    Union:'全部合并',
}
/* conf: {
    type:'ToggleCreate',
    typeC:'DataSource',//option
    data:{}, // workConf
}
*/
export function CreateAndRefresh(target, conf) {

    let hock = target._hock
    let type = conf.type
    let data = conf.data

    let typeC
    switch(type) {
        case 'ToggleCreate':
            let trans = getTransformXY(hock.workBench)
            let nodeData = {
                ...conf.typeC,
                x: target.posc.x - target.state.defaultTreePanelWidth - trans.x,
                y: target.posc.y - 64 - trans.y,
                text: `${hock.toggleSourceData.metaName}(${hock.toggleSourceData.tableName})`,
                _workConf: {...data, viewTableName: uuidStr()},
                id:uuid(),
            }
            addData(nodeData)
            checkNodePosition(target, hock.workBench, nodeData, target.renderD3)
            target.canCreate = false
            target.posc = null
            target.setState({isEdited: true})
        break
        case 'ModeAggregation':
        case 'Trans':
        case 'AddColumns':
        case 'ChangeColumn':
            target.setState({visibleSelfCalModal: false})
            typeC = DataType['Calc']
            if(typeC) {
                let nodeData = {
                    ...typeC,
                    x:hock.triggerSourceNode.x,
                    y:hock.triggerSourceNode.y + hock.triggerSourceNode.height + typeC.height / 2,
                    text: data.resultCollectionName,
                    _workConf: {...data, type: type, tableName: uuidStr()},
                    id: uuid()
                }
                let linkConf = {
                    source: hock.triggerSourceNode.id,
                    target: nodeData.id
                }
                addData(nodeData)
                addLink(linkConf)
                checkNodePosition(target, hock.workBench, nodeData, target.renderD3)
                
                execModelPartQuick(target, nodeData.id, nodeData._workConf.tableName).then(ok => {
                    if(ok) {
                        target.changeSelectedNode(nodeData, false)
                    }
                })
                // target.setState({isEdited: true})
            }
            hock.triggerSourceNode = null
        break
        case 'AggJoin':
        case 'LeftJoin':
        case 'FullJoin':
        case 'LeftExclude':
        case 'DistinctUnion':
        case 'Union':
            if(!hock.triggerSourceNode || !hock.triggerTargetNode) return
            target.setState({visibleAggModal: false})
            if(DataType['Union'] && DataType['Calc']) {
                // let trans = getTransformXY(hock.workBench)
                typeC = DataType['Union']
                let sD = hock.triggerSourceNode
                let tD = hock.triggerTargetNode
                let maxD = sD.y > tD.y ? sD:tD
                
                let nodeData = {
                    ...typeC,
                    x: (sD.x + tD.x + sD.width / 2 + tD.width / 2) / 2.0 - typeC.outR,
                    y: maxD.y + maxD.height + typeC.height / 2,
                    text: map[type],
                    _workConf: {...data, type: type, tableName: uuidStr()},
                    id: uuid()
                }
                addUnionData(nodeData)
                addLink({
                    source: hock.triggerSourceNode.id,
                    target: nodeData.id
                })
                addLink({
                    source: hock.triggerTargetNode.id,
                    target: nodeData.id
                })

                typeC = DataType['Calc']
                let linkConf = {
                    source: nodeData.id,
                    target: uuid()
                }
                nodeData = {
                    ...typeC,
                    x: nodeData.x + nodeData.outR,
                    y: nodeData.y + nodeData.height + typeC.height / 2,
                    text: data.resultCollectionName,
                    _workConf: {...data, type: type, tableName: uuidStr()},
                    id: linkConf.target
                }
                nodeData.x = nodeData.x - nodeData.width / 2
                addData(nodeData)
                addLink(linkConf)
                checkNodePosition(target, hock.workBench, nodeData, target.renderD3)
                execModelPartQuick(target, nodeData.id, nodeData._workConf.tableName).then(ok => {
                    if(ok) {
                        target.changeSelectedNode(nodeData, false)
                    }
                })
            }
            hock.triggerSourceNode = null
        break
    }

}