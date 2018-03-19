import React, {Component} from 'react';

function Greeting(props) {
  if (props.isLogin) {
    return <h1>Hello user.</h1>;
  } else {
    return <h1>Hello guest.</h1>
  }
}

function LoginButton(props) {
  return <button onClick={props.click}>Login</button>
}
function LogoutButton(props) {
  return <button onClick={props.click}>Logout</button>
}

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLogin:false
    }
  }

  render() {
    const isLogin = this.state.isLogin
    const LoginGroup = isLogin ? (<LogoutButton click={this.changeLogin} />) : (<LoginButton click={this.changeLogin} />)
    return (<div>
      {LoginGroup}
      <Greeting isLogin={isLogin} />
    </div>)
  }

  changeLogin = () => {
    this.setState(preState => ({
      isLogin:!preState.isLogin
    }))
  }


}

export default Login
