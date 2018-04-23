import React, {Component} from 'react'
import {Button} from 'antd'
import 'antd/dist/antd.css'

import {connect} from 'react-redux'

class ReduxCount extends Component {
  render() {
    const {counter, doClick} = this.props
    return (<div>
      <div>{counter}</div>
      <Button onClick={doClick} type='danger'>Add</Button>
      </div>)
  }
}

const action = {type:'INCREASE'}
function mapStateToProps(state) {
  return {counter:state.counter}
}
function mapDispatchToProps(dispatch) {
  return {doClick:() => dispatch(action)}
}
export default connect(mapStateToProps, mapDispatchToProps)(ReduxCount)
