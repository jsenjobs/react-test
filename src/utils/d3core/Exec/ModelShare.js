import {AFetchPostJson, AFetchJSON} from '../../AFetch'
import {message} from 'antd'
import Apis from '../../../Api/Apis'


export function createShare(modelId, modelName, intro) {
    return AFetchJSON(Apis.model.saveShareModel + `${modelId}/${modelName}/${intro}`).then(json => {
        if(json.code === 0) {
            message.success('发布模型成功')
            return true
        } else {
            message.error(`发布模型出错：${json.msg}`)
            return false
        }
    })
}

export function updateShareModel(modelId, shareModelName) {
    return AFetchJSON(Apis.model.updateShareModel + `${shareModelName}/${modelId}`).then(json => {
        if(json.code === 0) {
            message.success('更新模型成功')
        } else {
            message.error(`更新模型出错：${json.msg}`)
        }
    })
}

export function updateModelName(oldModelName, newModelName) {
    return AFetchJSON(Apis.model.updateName + `${oldModelName}/${newModelName}`).then(json => {
        if(json.code === 0 && json.effModel > 0) {
            message.success('更新模型名字成功')
            return true
        } else {
            message.error(`更新模型名字失败：${json.msg}`)
            return false
        }
    })
}