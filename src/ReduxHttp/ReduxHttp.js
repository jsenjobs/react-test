import React, {Component} from 'react'
import 'whatwg-fetch'
import {connect} from 'react-redux'
class ReduxHttp extends Component {
  render() {
    const {httpResult, onGetHttp} = this.props
    let data = ""
    if(httpResult.code === 0) {
      data = '正在获取数据'
    } else if(httpResult.code === 1) {
      data = JSON.stringify(httpResult.response)
    } else if(httpResult.code === -1) {
      data = '获取数据失败：' + JSON.stringify(httpResult.error)
    } else {
      data = '点击获取数据'
    }
    return (<div>
      <button onClick={onGetHttp}>GetHttp</button>
      <div>{data}</div>
      </div>)
  }
}

function mapStateToProps(state) {
  return {
    httpResult: state.httpResult
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onGetHttp: () => dispatch(fetchGets(dispatch))
  }
}

const fetchGets = (dispatch, requestID) => {
  dispatch({type:'FETCH_GET_REQUEST'})

  return fetch('http://gank.io/api/search/query/listview/category/福利/count/10/page/1', {
      headers: new Headers({
        'Accept': 'application/json'
      }),
      method:'GET',
      mode: 'cors'
  }).then(response => response.json()).then(json => {
    console.log(json)
    return {type:'FETCH_GET_SUCCESS', response:json}
  }).catch(e => {
    return {type:'FETCH_GET_FAILURE', error:e}
  })
}

/*
const body = {name:"Good boy"};
fetch("http://localhost:8000/API",{
    headers:{
        'content-type':'application/json'
    }
    method:'POST',
    body: JSON.stringify(body)
}).then(response =>
    response.json().then(json => ({ json, response }))
).then(({ json, response }) => {
   if (!response.ok) {
     return Promise.reject(json);
   }
   return json;
}).then(
   response => response,
   error => error
 );
*/

export default connect(mapStateToProps, mapDispatchToProps)(ReduxHttp)
