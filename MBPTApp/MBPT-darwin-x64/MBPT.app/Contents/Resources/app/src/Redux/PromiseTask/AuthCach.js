// 保存权限访问的缓存，防止多次加载，在退出时清空缓存


// reducer httpData_authInfos
export function httpData_authInfos(state = {}, action) {
    switch(action.type) {
        case 'HTTP_DATA_AUTH_INFOS_SET':
            let nState = {...state}
            nState[action.data.key] = action.data.value
            return nState
        case 'HTTP_DATA_AUTH_INFOS_CLEAR_ALL':
            return {}
        default:
            return state
    }
}