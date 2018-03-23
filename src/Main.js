// @flow
import {Layout, Menu, Breadcrumb, Icon} from 'antd'
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import RouteTest from './Route/RouteTest';
import PageEcharts from './Route/PageEcharts';
import Page1 from './Route/Page1';
import Page2 from './Route/Page2';

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
    return paths.map(path => <Breadcrumb.Item>{path}</Breadcrumb.Item>)
}

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline',
      defaultSelectedKeys:['/page1/page1']
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
    // alert('contentChanged changed' + e.key)
  }

  componentWillReceiveProps(props) {
      this.setState({
          defaultSelectedKeys: [props.location.pathname]
      })
  }

  render() {
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
          <Menu.Item key="/charts">
            <Icon type="pie-chart" />
            <span>图表</span>
          </Menu.Item>
          <Menu.Item key="/page2/page2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
          <Menu.Item key="/page1/page1">
            <Icon type="inbox" />
            <span>Option 3</span>
          </Menu.Item>
          <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
            <Menu.Item key="/g1/page1">Option 5</Menu.Item>
            <Menu.Item key="/g1/page2">Option 6</Menu.Item>
            <Menu.Item key="/g1/page3">Option 7</Menu.Item>
            <Menu.Item key="/g1/page4">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
            <Menu.Item key="/g2/page1">Option 9</Menu.Item>
            <Menu.Item key="/g2/page2">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="/g2/s1/page1">Option 11</Menu.Item>
              <Menu.Item key="/g2/s1/page2">Option 12</Menu.Item>
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
            <img src={logo} className="App-logo" alt="logo" />
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
            <Breadcrumb style={{margin:'12px 0'}}>
                <PathIndex item={this.state.defaultSelectedKeys[0]} />
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>
              <div>
                <RouteTest />
                  <Switch>
                    <Route exact path='/' /*  route path /path0 will fit /path0 /path0/xxxx and more if want only fit /path0 use exact(={true}) props*/ >
                      <Redirect to='/page1/page1' />
                    </Route>
                    <Route path='/charts' component={PageEcharts} />
                    <Route path='/page1/:name' component={Page1} />
                    <Route path='/page2/:name' component={Page2} />
                  </Switch>
                </div>
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

export default withRouter(Main);
