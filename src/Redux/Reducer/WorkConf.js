// 在建模页面 modal生成配置信息后传到建模组件
function reducer(state={}, action) {
    switch(action.type) {
      case 'ON_GET_MODEL_WORK_CONF':
        return action.data
      default:
        return state;
    }
  }
  export default reducer
  