// 用户登入凭证， 保存用户登入后返回的数据
function reducer(state={code:1, logout:true}, action) {
    switch(action.type) {
      case 'SET_ACCOUNT_INFO':
        return action.data;
      case 'CLEAR_ACCOUNT_INFO':
        return {code:1, logout:true}
      default:
        return state
    }
  }
  export default reducer
  