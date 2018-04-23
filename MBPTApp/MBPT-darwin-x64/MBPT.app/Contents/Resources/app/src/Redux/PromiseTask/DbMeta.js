import apis from '../../Api/Apis'
import {AFetch} from '../../utils/AFetch'
  
export function listTables(dispatch, dbName) {
    return AFetch(apis.dbMeta.listTables + dbName).then(response => response.json()).then(json => {
        return {type:'HTTP_GET_DB_META_TABLES_DATA', data:json}
    }).catch(e => {
        return {type:'HTTP_GET_DB_META_TABLES_DATA', data: {error:e, code:1}}
    })
}

export function listColumns(dispatch, tableName) {
    return AFetch(apis.dbMeta.listColumns + tableName).then(response => response.json()).then(json => {
        return {type:'HTTP_GET_DB_META_COLUMNS_DATA', data:json}
    }).catch(e => {
        return {type:'HTTP_GET_DB_META_COLUMNS_DATA', data: {error:e, code:1}}
    })
}