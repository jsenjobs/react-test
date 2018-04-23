function reducer(state = {code:1, data:[]}, action) {
    switch(action.type) {
        case 'HTTP_GET_TABLES_DATA':
            return action.data
        case 'HTTP_CLEAR_TABLES_DATA':
            return {code:1, data:[]}
        default:
            return state
    }
  }
  
  export default reducer
  