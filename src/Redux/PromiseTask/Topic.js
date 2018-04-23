import apis from '../../Api/Apis'
import {AFetch} from '../../utils/AFetch'
  
export function listTree(dispatch) {
    return AFetch(apis.topic.listTree).then(response => response.json()).then(json => {
        return {type:'HTTP_GET_TOPIC_TREE_DATA', data:json}
    }).catch(e => {
        return {type:'HTTP_GET_TOPIC_TREE_DATA', data: {error:e, code:1}}
    })
}