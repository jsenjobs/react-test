import { combineReducers } from 'redux'
import counter from './Counter'
import clock from './Clock'
import httpResult from './FetchRequest'
import loginState from './LoginState'
import accountInfo from './AccountInfo'
import workConf from './WorkConf'
import httpData_TopicTreeData from './HttpData/TopicTreeData'
import httpData_UserModelData from './HttpData/UserModelData'
import httpData_DbMetaData from './HttpData/DBMetaData'
import httpData_HcTableData from './HttpData/HcTableData'

import {httpData_TableColumnInfo} from '../PromiseTask/TableColumnInfo'
import {httpData_authInfos} from '../PromiseTask/AuthCach'

// 下面的组合对象会映射到state对应的key上
export default combineReducers({counter, clock, httpResult, loginState, accountInfo, workConf, httpData_TopicTreeData,
    httpData_UserModelData,
    httpData_DbMetaData,
    httpData_HcTableData,

    // 保存网络table的columnInfo {account:[],simple:[]}
    httpData_TableColumnInfo,
    httpData_authInfos,
})
