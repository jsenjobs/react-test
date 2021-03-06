// @flow
import {Layout, Menu, Breadcrumb, Icon, Dropdown, Modal, Row, Col, Button} from 'antd'
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import './Main.less';
import {connect} from 'react-redux'

import { withCookies } from 'react-cookie';

import {Link} from 'react-router-dom';

import NavConf from './conf/NavConf'
import {wrapAuth} from './conf/UIAuth'
import {getStore} from './utils/AFetch'

// we could use hashrouter or browserRouter
// hashs router : /#/page1 /#/page2 // if the web point is static resource more
// and browser router is  /page1 /page2 // if more dynamic request
// import { BrowserRouter as Router, HashRouter as Router, Route} from 'react-router-dom';
// switch will only render the first fit component and if no switch router will render all fit path's component
// Route component render// a component function in {} children //similary with render but it will be render any way{empty hold??}
import { withRouter} from 'react-router-dom';

const {Header, Content, Footer, Sider} = Layout
const AuthMenu = wrapAuth(Menu)

function PathIndex(props) {
  let p = props.item
  if(p.indexOf('/') === 0) {
    p = p.substring(1, p.length)
  }
    const paths = p.split('/')
    let base = ''
    return <Breadcrumb style={{margin:'12px 0'}}>{paths.map(path => {
      base += `/${path}`
      return <Breadcrumb.Item key={path}><Link to={base}>{path}</Link></Breadcrumb.Item>
    })}</Breadcrumb>
}


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline',
      defaultSelectedKeys:['/main/dashboard'],

      _username:'',
      _sex: -1,

      modalSelfInfoShow: false,
    }
    this.toggle = this.toggle.bind(this)
    this.contentChanged = this.contentChanged.bind(this)
  }

  toggle() {
    this.setState(preState => ({
      collapsed: !preState.collapsed
    }))
  }
  contentChanged(e) {
    /*
    this.props.history.push(e.key)
    this.setState({
        defaultSelectedKeys: [e.key]
    })*/
    // alert('contentChanged changed' + e.key)
  }
  onItemClick = e => {
    if(e.key !== this.props.location.pathname) {
      this.props.history.push(e.key)
      this.setState({
          defaultSelectedKeys: [e.key]
      })
    }
  }

  componentWillMount() {
    this.setState({
        defaultSelectedKeys: this.props.location.pathname
    })
    console.log(this.props.cookies.cookies)
    let _sex = this.props.cookies.cookies._sex
    if(_sex === '0' || _sex === '1') {
      _sex = parseInt(_sex)
    } else {
      _sex = -1
    }
    this.setState({_username: this.props.cookies.cookies._username, _sex})
  }
  componentWillReceiveProps(props) {

    // getKey
      this.setState({
          defaultSelectedKeys: [NavConf.getKey(props.history.location.pathname, this.state.defaultSelectedKeys[0])]
      })
  }

  logout = () => {
    const {cookies} = this.props
    cookies.remove('_username')
    cookies.remove('_password')
    cookies.remove('_token')
    cookies.remove('_rToken')
    cookies.remove('_sex')
    this.props.logout()
    this.props.history.push('/login')
    getStore().dispatch({type:'HTTP_DATA_AUTH_INFOS_CLEAR_ALL'})
  }



  render() {
    return (
      <Layout className='container-main'>
        <Sider trigger={null}
        collapsible
        className='main-side-menu'
        collapsed={this.state.collapsed}>
        <div className='logo' >
          <img src={logo} className="App-logo small" alt="logo" />
        </div>
        <AuthMenu
          permission='sys:ui'
          selectedKeys={this.state.defaultSelectedKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          // defaultOpenKeys={['ajax','auth']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          onSelect={this.contentChanged}
          onClick={this.onItemClick}
          className='main-menu'
        >
        {NavConf.navConf}
        </AuthMenu>
        </Sider>
        <Layout style={{display:'flex'}}>
          <Header style={{padding:0}}>
          <span style={{color:'#fff',  paddingLeft:'2%', fontSize:'1.4em'}}>
          <Icon className='trigger' type={this.state.collapsed? 'menu-unfold':'menu-fold'}
          onClick={this.toggle}
          style={{cursor:'pointer'}} />
          </span>
          <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>666</span>
          <span style={{color:'#fff', float:'right', paddingLeft:'1%'}}>
          <Dropdown overlay={(
            <Menu>
            <Menu.Item>
              <div onClick={this.logout}>退出登入</div>
            </Menu.Item>
              <Menu.Item>
                <div onClick={_ => this.setState({modalSelfInfoShow: true})}>个人资料</div>
              </Menu.Item>
            </Menu>
          )} placement="bottomRight">
            <div style={{marginRight:18}}>{this.state._username}</div>
          </Dropdown>
          </span>
          {/*
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{marginTop:'8px', color:'#fff', float:'right', paddingLeft:'1%'}}
          >
            <Menu.Item style={{height:'100%'}} key="1"><Link to='/main/resourcesearch'>搜索资源</Link></Menu.Item>
            <Menu.Item style={{height:'100%'}} key="2"><Link to='/model/edit'>数据建模</Link></Menu.Item>
            <Menu.Item style={{height:'100%'}} key="3"><Link to='/main/modeshare'>模型库</Link></Menu.Item>
          </Menu>*/}
          </Header>
          <Content style={{margin:'0 16px', overflow: 'initial', flex:1}}>
            <PathIndex item={this.state.defaultSelectedKeys[0]} />
            <div style={{ padding: 24, background: '#fff', height: '100%' }}>
              {NavConf.routes}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            MBPT ©2018 Created by Jsen
          </Footer>
        </Layout>
        <Modal title="用户信息" visible={this.state.modalSelfInfoShow}
          onOk={this.doChangeSelfInfo} onCancel={_ => this.setState({modalSelfInfoShow: false})}
        >
        <Row>
          <Col span='12'>用户名：{this.state._username}</Col>
          <Col span='12'>性别：{this.state._sex === 0 ? '男' : this.state._sex === 1 ? '女' : '未知'}</Col>
          </Row>
        </Modal>
      </Layout>
    );
  }

  doChangeSelfInfo = () => {
    this.setState({modalSelfInfoShow: false})
  }
}

function mapStateToProps(state) {
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch({type:'CLEAR_ACCOUNT_INFO'}),
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withCookies(Main)))
