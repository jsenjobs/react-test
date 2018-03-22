const fetchGets = (dispatch, page) => {
  alert(page)
  dispatch({type:'FETCH_GET_REQUEST'})

  return fetch('http://gank.io/api/search/query/listview/category/福利/count/10/page/' + page, {
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
export default fetchGets
