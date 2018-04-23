import DataType from '../ModelTypes'
import {getTransformXY} from './Utils'
import {addData, addUnionData, addLink} from '../ModelConf'
import {checkNodePosition} from './AreaChecker'
const map = {
    AggJoin:'内连接',
    LeftJoin:'左连接',
    FullJoin:'全连接',
    LeftExclude:'左排除',
    DistinctUnion:'去重合并',
    Union:'全部合并',
}
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
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
                _workConf: data,
                id:uuid(),
            }
            addData(nodeData)
            checkNodePosition(hock.workBench, nodeData, target.renderD3)
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
                    _workConf: {...data, type: type},
                    id: uuid()
                }
                let linkConf = {
                    source: hock.triggerSourceNode.id,
                    target: nodeData.id
                }
                addData(nodeData)
                addLink(linkConf)
                checkNodePosition(hock.workBench, nodeData, target.renderD3)
                target.setState({isEdited: true})
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
                    _workConf: {...data, type: type},
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
                    text: map[type],
                    _workConf: {...data, type: type},
                    id: linkConf.target
                }
                nodeData.x = nodeData.x - nodeData.width / 2
                addData(nodeData)
                addLink(linkConf)
                checkNodePosition(hock.workBench, nodeData, target.renderD3)
                target.setState({isEdited: true})
            }
            hock.triggerSourceNode = null
        break
    }

}