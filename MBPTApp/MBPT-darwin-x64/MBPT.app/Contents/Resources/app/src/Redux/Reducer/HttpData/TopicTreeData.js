function reducer(state = {code:1}, action) {
    switch(action.type) {
        case 'HTTP_GET_TOPIC_TREE_DATA':
            return action.data
        case 'HTTP_CLEAR_TOPIC_TREE_DATA':
            return {code:1}
        default:
            return state
    }
  }
  
  export default reducer
  