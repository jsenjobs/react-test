import apis from '../../Api/Apis'
import {AFetch} from '../../utils/AFetch'
  
export function listTable(dispatch) {
    return AFetch(apis.table.list).then(response => response.json()).then(json => {
        return {type:'HTTP_GET_TABLES_DATA', data:json}
    }).catch(e => {
        return {type:'HTTP_GET_TABLES_DATA', data: {error:e, code:1, data:[]}}
    })
}