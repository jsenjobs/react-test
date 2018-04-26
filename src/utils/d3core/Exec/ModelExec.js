import {AFetchPostJson, AFetchJSON} from '../../AFetch'
import {message} from 'antd'
import {getDatas, getLinks, getUnionDatas} from '../ModelConf'
import {updateExecResult} from '../Change/AttributeUpdate'
import Apis from '../../../Api/Apis'


export function save(target, innerSave = false) {
    if(target.state.currentFileName === '未命名') {
        message.warning('请重命名文件')
        return new Promise(resolve => {
            resolve(false)
        })
    }
    let hock = target._hock
    let result = {
        datas:getDatas(),
        links:getLinks(),
        unionDatas:getUnionDatas(),
        transform:hock.workBench.attr('transform'),
        width:hock.workBench.attr('width'),
        height:hock.workBench.attr('height'),
        defaultAttrPanelWidth: target.state.defaultAttrPanelWidth,
        defaultEditorPanelWidth: target.state.defaultEditorPanelWidth,
        defaultTreePanelWidth: target.state.defaultTreePanelWidth,
        tableFilters: target.state.tableFilters,
        lastSaveTime: target.state.lastSaveTime,
    }

    let data = encodeURIComponent(JSON.stringify(result))
    if(target.state.currentModelId === -1) {
        // save
        return AFetchPostJson(Apis.model.create, 'name=' + target.state.currentFileName + '&intro=介绍&modelData=' + data)
          .then(json => {
              if(json.code === 0) {
                  target.setState({lastSaveTime: new Date().toLocaleString(), isEdited: false, currentModelId: json.data.id})
                  if(!innerSave)
                    message.success('保存成功')
                  return true
              } else {
                  message.warn('保存失败：' + json.msg)
                  return false
              }
          })
    } else {
        // update
        return AFetchPostJson(Apis.model.update, 'name=' + target.state.currentFileName + '&intro=介绍&modelData=' + data + '&id=' + target.state.currentModelId)
          .then(json => {
              if(json.code === 0) {
                target.setState({lastSaveTime: new Date().toLocaleString(), isEdited: false})
                message.success('更新成功')
                return true
              } else {
                  message.error('保存失败：' + json.msg)
                  return false
              }
          })
    }
}
export function execModelPart(target) {
    if(target.state.currentModelId === -1) {
        return new Promise(resolve => {
            message.warn('请先保存模型，取消执行')
            resolve(false)
        })
    }
    
    if(target.state.currentModelId != -1 && !target.state.currentSelectedNodeConf) {
        return new Promise(resolve => {
            message.warn('请选择模型')
            resolve(false)
        })
    }

    if(target.state.isEdited) {
        return save(target, true).then(succeed => {
            if(succeed) {
                return AFetchJSON(Apis.task.core.execPart + `?id=${target.state.currentModelId}&uuid=${target.state.currentSelectedNodeConf.id}`).then(json => {
                    if(json.code === 0) {
                        message.success('执行成功')
                        updateExecResult(target, json.data, target.state.currentSelectedNode)
                        return true
                    } else {
                        return false
                    }
                })
            }
        })
    } else {
        return AFetchJSON(Apis.task.core.execPart + `?id=${target.state.currentModelId}&uuid=${target.state.currentSelectedNodeConf.id}`).then(json => {
            if(json.code === 0) {
                message.success('执行成功')
                updateExecResult(target, json.data, target.state.currentSelectedNode)
                return true
            } else {
                return false
            }
        })
    }
}

export function execModel(target) {
    target.setState({currentSelectedNodeConf:{type: 'ModelAll'}, currentSelectedNode: '00_total'})
    if(target.state.currentModelId === -1) {
        return new Promise(resolve => {
            message.warn('请先保存模型，取消执行')
            resolve(false)
        })
    }

    if(target.state.isEdited) {
        return save(target, true).then(succeed => {
            if(succeed) {
                return AFetchJSON(Apis.task.core.execModel + `${target.state.currentModelId}`).then(json => {
                    if(json.code === 0) {
                        message.success('执行成功')
                        console.log(target.state.currentSelectedNode)
                        updateExecResult(target, json.data, target.state.currentSelectedNode)
                        return true
                    } else {
                        return false
                    }
                })
            }
        })
    } else {
        return AFetchJSON(Apis.task.core.execModel + `${target.state.currentModelId}`).then(json => {
            if(json.code === 0) {
                message.success('执行成功')
                console.log(target.state.currentSelectedNode)
                updateExecResult(target, json.data, target.state.currentSelectedNode)
                return true
            } else {
                return false
            }
        })
    }
}

export function execModelPartQuick(target, selectNodeUUID, tableName) {
    
    if(target.state.currentModelId === -1) {
        return new Promise(resolve => {
            message.warn('取消执行')
            resolve(false)
        })
    }
    
    if(target.state.currentModelId != -1 && !selectNodeUUID) {
        return new Promise(resolve => {
            message.warn('请选择模型')
            resolve(false)
        })
    }

    if(target.state.isEdited) {
        return save(target, true).then(succeed => {
            if(succeed) {
                return AFetchJSON(Apis.task.core.execPart + `?id=${target.state.currentModelId}&uuid=${selectNodeUUID}`).then(json => {
                    if(json.code === 0) {
                        message.success('执行成功')
                        updateExecResult(target, json.data, tableName)
                        return true
                    } else {
                        return false
                    }
                })
            }
        })
    } else {
        return AFetchJSON(Apis.task.core.execPart + `?id=${target.state.currentModelId}&uuid=${selectNodeUUID}`).then(json => {
            if(json.code === 0) {
                message.success('执行成功')
                updateExecResult(target, json.data, tableName)
                return true
            } else {
                return false
            }
        })
    }


}