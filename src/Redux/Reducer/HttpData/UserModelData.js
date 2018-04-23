function reducer(state = {code:1}, action) {
    switch(action.type) {
        case 'HTTP_GET_USER_MODEL_DATA':
            return action.data
        case 'HTTP_CLEAR_USER_MODEL_DATA':
            return {code:1}
        default:
            return state
    }
  }
  
  export default reducer
  