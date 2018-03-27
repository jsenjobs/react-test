// @flow
import {Layout, Menu, Breadcrumb, Icon, Dropdown} from 'antd'
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux'

// import RouteTest from './Route/RouteTest';
import PageEcharts from './Route/PageEcharts';
import D3Charts from './Route/D3Charts';
import Page1 from './Route/Page1';
import Page2 from './Route/Page2';
import Editor from './group1/Editor'
import UMLGOJSSimple1 from './Route/DG/GOJS/Simple1'
import UMLGOJSSimple2 from './Route/DG/GOJS/Simple2'
import { withCookies } from 'react-cookie';

// we could use hashrouter or browserRouter
// hashs router : /#/page1 /#/page2 // if the web point is static resource more
// and browser router is  /page1 /page2 // if more dynamic request
// import { BrowserRouter as Router, HashRouter as Router, Route} from 'react-router-dom';
// switch will only render the first fit component and if no switch router will render all fit path's component
// Route component render// a component function in {} children //similary with render but it will be render any way{empty hold??}
import { withRouter, Route, Switch, Redirect} from 'react-router-dom';

const {Header, Content, Footer, Sider} = Layout
const {SubMenu} = Menu


function PathIndex(props) {
    const paths = props.item.split('/')
    return <Breadcrumb style={{margin:'12px 0'}}>{paths.map(path => <Breadcrumb.Item key={path}>{path}</Breadcrumb.Item>)}</Breadcrumb>
}


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline',
      defaultSelectedKeys:['/main/charts']
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
    this.props.history.push(e.key)
    this.setState({
        defaultSelectedKeys: [e.key]
    })
    // alert('contentChanged changed' + e.key)
  }

  componentWillReceiveProps(props) {
    /*
    alert('change')
      this.setState({
          defaultSelectedKeys: [props.location.pathname]
      })
      */
  }

  logout = () => {
    const {cookies} = this.props
    cookies.remove('_userName')
    cookies.remove('_password')
    this.props.logout()
    this.props.history.push('/login')
  }

  render() {
    const l1 = [{key:'/main/charts', icon:'pie-chart', title:'ECharts'}, 
    {key:'/main/d3', icon:'pie-chart', title:'D3'}, 
    {key:'/main/page1', icon:'desktop', title:'测试1'}, 
    {key:'/main/page2', icon:'inbox', title:'Redux'}]
    const l2_1 = [{key:'/main/g1/editor', title:'编辑器'}, 
      {key:'/main/g1/page1', title:'Option 6'}, 
      {key:'/main/g1/page2', title:'Option 7'}, 
      {key:'/main/g1/page3', title:'Option 8'}]
    const l2_2 = [{key:'/main/dg/charts1', title:'Option 9'}, 
      {key:'/main/dg/page6', title:'otion 10'}]
    const l3 = [{key:'/main/dg/gojs/simple1', title:'Simple1'}, 
      {key:'/main/dg/gojs/simple2', title:'Simple2'}]
    const Comp1 = l1.map(d => (<Menu.Item key={d.key}><Icon type={d.icon} /><span>{d.title}</span></Menu.Item>))
    const Comp2 = l2_1.map(d => (<Menu.Item key={d.key}>{d.title}</Menu.Item>))
    const Comp3 = l2_2.map(d => (<Menu.Item key={d.key}>{d.title}</Menu.Item>))
    const Comp4 = l3.map(d => (<Menu.Item key={d.key}>{d.title}</Menu.Item>))
    return (
      <Layout>
        <Sider trigger={null}
        collapsible
        collapsed={this.state.collapsed}>
        <div className='logo' >
          <img src={logo} className="App-logo small" alt="logo" />
        </div>
        <Menu
          selectedKeys={this.state.defaultSelectedKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          onSelect={this.contentChanged}
        >
        {Comp1}

          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>组1</span></span>}>
            {Comp2}
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>DG</span></span>}>
            {Comp3}
            <SubMenu key="sub3" title="GOJS">
              {Comp4}
            </SubMenu>
          </SubMenu>
        </Menu>
        </Sider>
        <Layout>
          <Header style={{background:'#000', padding:0}}>
          <span style={{color:'#fff',  paddingLeft:'2%', fontSize:'1.4em'}}>
          <Icon className='trigger' type={this.state.collapsed? 'menu-unfold':'menu-fold'}
          onClick={this.toggle}
          style={{cursor:'pointer'}} />
          </span>
          <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>Information Management System</span>
          <span style={{color:'#fff', float:'right', paddingLeft:'1%'}}>
          <Dropdown overlay={(
            <Menu>
              <Menu.Item>
                <div onClick={this.logout}>Logout</div>
              </Menu.Item>
            </Menu>
          )} placement="bottomRight">
            <img src={logo} className="App-logo" alt="logo" />
          </Dropdown>
          </span>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{marginTop:'8px', color:'#fff', float:'right', paddingLeft:'1%'}}
          >
            <Menu.Item style={{height:'100%'}} key="1">nav 1</Menu.Item>
            <Menu.Item style={{height:'100%'}} key="2">nav 2</Menu.Item>
            <Menu.Item style={{height:'100%'}} key="3">nav 3</Menu.Item>
          </Menu>
          </Header>
          <Content style={{margin:'0 16px', overflow: 'initial'}}>
            <PathIndex item={this.state.defaultSelectedKeys[0]} />
            <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>

              <Switch>
                <Route exact path='/main'  >
                  <Redirect to='/main/charts' />
                </Route>
                <Route path='/main/charts' component={PageEcharts} />
                <Route path='/main/d3' component={D3Charts} />
                <Route path='/main/page1' component={Page1} />
                <Route path='/main/page2' component={Page2} />
                <Route path='/main/g1/editor' component={Editor} />
                <Route path='/main/dg/gojs/simple1' component={UMLGOJSSimple1} />
                <Route path='/main/dg/gojs/simple2' component={UMLGOJSSimple2} />
              </Switch>
                {/*
                <RouteTest />
                  <Switch>
                    // route path /path0 will fit /path0 /path0/xxxx and more if want only fit /path0 use exact(={true}) props
                    <Route exact path='/main'  >
                      <Redirect to='/main/charts' />
                    </Route>
                    <Route path='/main/page1' component={Page1} />
                    <Route path='/main/page2' component={Page2} />
                  </Switch>
                  */}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
        <div className="App">
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch({type:'LOGOUT'}),
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withCookies(Main)))
