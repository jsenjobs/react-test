// 选择登入页 或者主页

import React, {Component} from 'react'

import {connect} from 'react-redux'

import Main from './Main'
import { withRouter} from 'react-router-dom';

class StateSelect extends Component {

    componentDidMount() {
        const {loginState} = this.props
        if(!loginState) {
            this.props.history.push('/login')
        }
    }
    render() {
        return <Main />
    }
}

function mapStateToProps(state) {
    return {
      loginState: state.loginState
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
    }
  }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StateSelect))