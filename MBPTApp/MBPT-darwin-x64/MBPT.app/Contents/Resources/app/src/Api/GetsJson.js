
import 'whatwg-fetch'
const getsJson = (dispatch, api) => {
    dispatch({type:'FETCH_GET_REQUEST'})
  
    return fetch(api).then(response => response.json()).then(json => {
      return {type:'FETCH_GET_SUCCESS', response:json}
    }).catch(e => {
      return {type:'FETCH_GET_FAILURE', error:e}
    })
  }
  
  export default getsJson