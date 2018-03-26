
import 'whatwg-fetch'
import apis from './Apis'
const login = (dispatch, domain = 'jsen', token = 'e10adc3949ba59abbe56e057f20f883e') => {
    dispatch({type:'FETCH_GET_REQUEST'})
  
    return fetch(apis.account.login + domain + '/' + token).then(response => response.json()).then(json => {
        if(json.code === 0) 
            dispatch({type:'LOGIN'})
        return {type:'FETCH_GET_SUCCESS', response:json}
    }).catch(e => {
      dispatch({type:'LOGOUT'})
      return {type:'FETCH_GET_FAILURE', error:e}
    })
  }
  
  export default {login}