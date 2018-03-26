import React, {Component} from 'react'
import {Layout, Form, Input, Checkbox, Icon, Button} from 'antd'
import './Login.css'
import 'antd/dist/antd.css'
import {connect} from 'react-redux'
import {account} from './Api'
import { withRouter} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import md5 from 'js-md5'

const FormItem = Form.Item;

class Login extends Component {
    componentDidMount() {
        const { cookies } = this.props;
        let userName = cookies.get('_userName')
        let password = cookies.get('_password')
        if(userName && password) {
            this.userInfo = {userName:userName, password:password}
            this.props.login(userName, md5(password))
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.loginState) {
            const { cookies } = this.props;
            cookies.set('_userName', this.userInfo.userName)
            cookies.set('_password', this.userInfo.password)
            nextProps.history.push('/main')
        }
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const {httpResult} = this.props

 

        return (<Layout>
            <div className='box'>
                <div className='box-item' />
                <div className='box-v'>
                <div className='box-item' />
                <Form onSubmit={this.handleLogin} className='login-form'>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <a href="">register now!</a>
                    </FormItem>
                </Form>
                <div className='box-item' />
                </div>
                <div className='box-item' />
            </div>
            <h2>httpResult:{JSON.stringify(httpResult)}</h2>
        </Layout>)

    }

    handleLogin = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.userInfo = values
                this.props.login(values.userName, md5(values.password))
            }
        });
    }

    handleClick = () => {
        if(this.props.loginState) {
            this.props.logout()
        } else {
            this.props.login(this.inputDomain.value, md5(this.inputToken.value))
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
      login: (domain, token) => dispatch(account.login(dispatch, domain, token)),
      logout: () => dispatch({type:'LOGOUT'}),
    }
  }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(withCookies(Login))))