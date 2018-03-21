import React, {Component} from 'react'

function ShowLoginState(props) {
    return (<div>
        {props.isLogin && (<h1>User is login</h1>)}
        {!props.isLogin && (<h1>User is not login</h1>)}
    </div>)
}

function ShowLoginButton(props) {
    return (<div>
            {props.isLogin && (<button onClick={props.click}>Logout</button>)}
            {!props.isLogin && (<button onClick={props.click}>Login</button>)}
        </div>)
}

class LoginState extends Component {
    constructor(props) {
        super(props)
        
        this.state = {isLogin:false}
    }

    render() {

        return (<div>
            <ShowLoginState isLogin={this.state.isLogin} />
            <ShowLoginButton isLogin={this.state.isLogin} click={this.handleClick} />
        </div>)

    }

    handleClick = () => {
        this.setState(preState => ({
            isLogin:!preState.isLogin
        }))
    }
}

export default LoginState