import 'whatwg-fetch'
import apis from '../../Api/Apis'
  
export function login(dispatch, username, password ) {
    return fetch(apis.user.login + username + '/' + password).then(response => response.json()).then(json => {
        return {type:'SET_ACCOUNT_INFO', data:json}
    }).catch(e => {
        return {type:'SET_ACCOUNT_INFO', data: {error:e, code:1}}
    })
}