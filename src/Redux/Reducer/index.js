import { combineReducers } from 'redux'
import counter from './Counter'
import clock from './Clock'
import httpResult from './FetchRequest'

// 下面的组合对象会映射到state对应的key上
export default combineReducers({counter, clock, httpResult})
