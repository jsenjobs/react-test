import { combineReducers } from 'redux'
import counter from './Counter'
import clock from './Clock'

export default combineReducers({counter, clock})
