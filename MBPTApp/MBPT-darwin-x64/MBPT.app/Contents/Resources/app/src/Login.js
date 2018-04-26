import React, {Component} from 'react'
import {Layout, Form, Input, Checkbox, Icon, Button, message} from 'antd'
import './Login.css'
import 'antd/dist/antd.css'
import logo from './logo.png'
import {connect} from 'react-redux'
import { login } from './Redux/PromiseTask/Login'
import { withRouter} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import md5 from 'js-md5'
import {getStore} from './utils/AFetch'

const FormItem = Form.Item;

function ComponentAppInit(props) {
    return (<div id='app-init'>
        <div className='hold' />
        <div className='h-center' >
            <div className='hold' />
            <div>
                <img src={logo} className="App-logo large" />
            </div>
            <h1 style={{textAlign:'center',color:'#fff'}}>
                应用初始化...
            </h1>
            <div className='hold' />
        </div>
        <div className='hold' />
    </div>)
}

class Login extends Component {

    state = {
        showInit: true
    }
    componentWillMount() {
        const { cookies } = this.props;
        let username = cookies.cookies._username
        let password = cookies.cookies._password

        if(username && password) {
            this.setState({showInit:true})
            this.userInfo = {username:username, password:password}
            setTimeout(_ => {
                this.props.login(username, md5(password))
            }, 2000)
        } else {
            setTimeout(_ => {
                this.setState({showInit:false})
            }, 600)
        }
    }
    // cookies.get not work on electron file system
    componentWillReceiveProps(nextProps) {
        if(nextProps.accountInfo && nextProps.accountInfo.code === 0) {
            this.setState({showInit:true})
            const json = nextProps.accountInfo
            const { cookies } = this.props;
            cookies.set('_password', this.userInfo.password)
            cookies.set('_username', json.username)
            cookies.set('_token', json.token)
            cookies.set('_rToken', json.rToken)
            cookies.set('_rToken', json.rToken)
            cookies.set('_sex', json.sex)

            // console.log(cookies)
            // console.log(cookies.cookies)
            // console.log(cookies.get)
            // console.log(cookies.set)
            // console.log(cookies.cookies._username)
            // console.log(json.username)
            // console.log(cookies.get('_username')) // not work on electron file://

            // let username = cookies.get('_username')
            // let password = cookies.get('_password')
            // let token = cookies.get('_token')
            // let rToken = cookies.get('_rToken')

            console.log({token:cookies.cookies._token, rToken:cookies.cookies._rToken, code:0})
            nextProps.history.push('/main')
            getStore().dispatch({type:'SET_ACCOUNT_INFO', data:{token:cookies.cookies._token, rToken:cookies.cookies._rToken, code:0}})
        } else {
            if(nextProps.accountInfo && nextProps.accountInfo.code !== 0 && !nextProps.accountInfo.logout) {
                message.error('登入失败')
                this.props.logout()
            }
            this.setState({showInit:false})
        }
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const {httpResult} = this.props

        const c = this.state.showInit ? (<ComponentAppInit />) : 
        (<Layout>
            <div className='box'>
                <div className='box-item' />
                <div className='box-v'>
                <div className='box-item' />
                <Form onSubmit={this.handleLogin} className='login-form'>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user"/>} placeholder="用户名" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock"/>} type="password" placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登入
                        </Button>
                    </FormItem>
                </Form>
                <div className='box-item' />
                </div>
                <div className='box-item' />
            </div>
            {
            // <h2>httpResult:{JSON.stringify(httpResult)}</h2>
            }
        </Layout>)
 
        return (<div  className='app-init'>{c}</div>)

    }

    handleLogin = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.userInfo = values
                this.props.login(values.username, md5(values.password))
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
      accountInfo: state.accountInfo,
    }
  }
  function mapDispatchToProps(dispatch) {
    return {
      login: (domain, token) => dispatch(login(dispatch, domain, token)),
      logout: () => dispatch({type:'CLEAR_ACCOUNT_INFO'}),
    }
  }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(withCookies(Login))))