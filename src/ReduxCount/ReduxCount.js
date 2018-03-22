import React, {Component} from 'react'

import {connect} from 'react-redux'

class ReduxCount extends Component {
  render() {
    const {counter, doClick} = this.props
    return (<div>
      <span>{counter}</span>
      <button onClick={doClick}>Add</button>
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
