import apis from '../../Api/Apis'
import {AFetch} from '../../utils/AFetch'
  
export function listUserModel(dispatch) {
    return AFetch(apis.model.find).then(response => response.json()).then(json => {
        if(json.code === 0) {
            try{
                json.data = json.data.map(d => {
                    d.modelData = JSON.parse(d.modelData)
                    return d
                })
                console.dir(json)
                return {type:'HTTP_GET_USER_MODEL_DATA', data:json}
            } catch(e) {
                return {type:'HTTP_GET_USER_MODEL_DATA', data: {error:'json解析出错', code:1}}
            }
        } else {
            return {type:'HTTP_GET_USER_MODEL_DATA', data:json}
        }
    }).catch(e => {
        return {type:'HTTP_GET_USER_MODEL_DATA', data: {error:e, code:1}}
    })
}