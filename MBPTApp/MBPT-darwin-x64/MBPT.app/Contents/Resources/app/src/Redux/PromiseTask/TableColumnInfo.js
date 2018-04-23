import apis from '../../Api/Apis'
import {AFetchJSON, getStore} from '../../utils/AFetch'
  
export function listColumnInfoByTableName(dispatch, tableName, force = false) {
    if(!force) {
        let datas = getStore().getState().httpData_TableColumnInfo[tableName]
        if(datas && datas.length > 0) {
            return {type: 'OK_HTTP_GET_TABLE_COLUMN_INFO'}
        } else {
            return doFetch(dispatch, tableName)
        }
    } else {
        return doFetch(dispatch, tableName)
    }
}

function doFetch(dispatch, tableName) {
    return AFetchJSON(apis.dbMeta.listColumns + tableName).then(json => {
        if(json.code === 0) {
            return {type:'HTTP_GET_TABLE_COLUMN_INFO', data:{name: tableName, data:json.data}}
        } else {
            return {type: 'NOT_HTTP_GET_TABLE_COLUMN_INFO'}
        }
    })
}

export function httpData_TableColumnInfo(state = {}, action) {
    switch(action.type) {
        case 'HTTP_GET_TABLE_COLUMN_INFO':
            let nState = {...state}
            nState[action.data.name] = action.data.data
            console.log(nState)
            return nState
        case 'HTTP_CLEAR_TABLE_COLUMN_INFO':
            return {}
        default:
            return state
    }
}