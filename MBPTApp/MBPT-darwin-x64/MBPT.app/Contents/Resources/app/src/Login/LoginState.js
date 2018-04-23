import React, {Component} from 'react'
import {Button} from 'antd'
import 'antd/dist/antd.css'

import {connect} from 'react-redux'
import {account} from '../Api'

function ShowLoginState(props) {
    return (<div>
        {props.isLogin && (<h1>User is login</h1>)}
        {!props.isLogin && (<h1>User is not login</h1>)}
    </div>)
}

function ShowLoginButton(props) {
    return (<div>
            {props.isLogin && (<Button  type="primary" onClick={props.click}>Logout</Button>)}
            {!props.isLogin && (<Button  type="primary" onClick={props.click}>Login</Button>)}
        </div>)
}

class LoginState extends Component {
    constructor(props) {
        super(props)
        
        this.state = {isLogin:false}
    }

    render() {
        const {httpResult, loginState} = this.props

        return (<div>
            <ShowLoginState isLogin={loginState} />
            <ShowLoginButton isLogin={loginState} click={this.handleClick} />
            <h2>httpResult:{JSON.stringify(httpResult)}</h2>
        </div>)

    }

    handleClick = () => {
        if(this.props.loginState) {
            this.props.logout()
        } else {
            this.props.login()
        }
    }
}

function mapStateToProps(state) {
    return {
      httpResult: state.httpResult,
      loginState: state.loginState
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
      login: () => dispatch(account.login(dispatch)),
      logout: () => dispatch({type:'LOGOUT'}),
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(LoginState)