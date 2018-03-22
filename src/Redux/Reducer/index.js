import { combineReducers } from 'redux'
import counter from './Counter'
import clock from './Clock'
import httpResult from './FetchRequest'

export default combineReducers({counter, clock, httpResult})
