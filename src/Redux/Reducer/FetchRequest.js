function reducer(state={code:2}, action) {
  switch(action.type) {
    case 'FETCH_GET_REQUEST':
      return {code:0};
    case 'FETCH_GET_FAILURE':
      return {code:-1, error:action.error}
    case 'FETCH_GET_SUCCESS':
      return {code:1, response:action.response}
    default:
      return state;
  }
}
export default reducer
