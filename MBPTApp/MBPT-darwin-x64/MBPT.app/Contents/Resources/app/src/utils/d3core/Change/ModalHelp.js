import {Modal, message} from 'antd'
import {deleteNode} from '../CRUD'
import {AFetchJSON} from '../../AFetch'
import Apis from '../../../Api/Apis'
const {confirm} = Modal

export function showDelNodeModal(target, d) {
    // 删除tableView 删除tableFilter 删除节点 删除链接
    confirm({
        title:'确定删除该节点吗？',
        content:'删除后不可恢复',
        onOk() {
            deleteNode(d.id, delArrays => {
                AFetchJSON(Apis.task.core.delViewTable + JSON.stringify(delArrays)).then(json => {
                    if(json.code === 0) {
                        let dTableName = d._workConf.tableName
                        let {tableFilters, currentSelectedNode, currentSelectedNodeConf} = target.state
                        if(tableFilters[dTableName]) {
                            delete tableFilters[dTableName]
                        }
                        if(currentSelectedNode === dTableName) {
                            currentSelectedNode = null
                            currentSelectedNodeConf = null
                        }
                        target.setState({tableFilters, currentSelectedNode, currentSelectedNodeConf})
                        target.renderD3()
                    } else {
                        message.warn('删除模型视图失败：' + json.msg)
                    }
                })
            })
        },
        onCancel() {
        }
    })
}