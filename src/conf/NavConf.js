import { Menu, Icon} from 'antd'
import React from 'react'

import {Route, Switch, Redirect} from 'react-router-dom';

import $ from '../Route'


const {SubMenu} = Menu

const navItems = [
    {key:'/main/charts', icon:'pie-chart', title:'ECharts', component:$.PageEcharts},
    {key:'/main/d3', icon:'pie-chart', title:'D3', component:$.D3Charts}, 
    {key:'/main/page1', icon:'desktop', title:'测试1', component:$.Page1}, 
    {key:'/main/page2', icon:'inbox', title:'Redux', component:$.Page2},
    {key:'sub1', icon:'maile', title:'组1',children:[
        {key:'/main/g1/editor', title:'编辑器', component: $.Editor}, 
        {key:'/main/g1/page1', title:'Option 6'}, 
        {key:'/main/g1/page2', title:'Option 7'}, 
        {key:'/main/g1/page3', title:'Option 8'}
    ]},
    {key:'sub2', icon:'appstore', title:'DG',children:[
        {key:'/main/dg/charts1', title:'Option 9'}, 
        {key:'/main/dg/page6', title:'otion 10'},
        {key:'ssub1', title:'GOJS', children:[
            {key:'/main/dg/gojs/simple1', title:'Simple1', component:$.UMLGOJSSimple1}, 
            {key:'/main/dg/gojs/simple2', title:'Simple2', component:$.UMLGOJSSimple2}, 
            {key:'/main/dg/gojs/simple3', title:'Simple3', component:$.UMLGOJSSimple3}
        ]},
        {key:'ssub2', title:'D3', children:[
            {key:'/main/dg/d3/simple1', title:'Simple1', component:$.UMLD3Simple001}, 
            {key:'/main/dg/d3/simple2', title:'Simple2', component:$.UMLD3Simple002}, 
            {key:'/main/dg/d3/simple3', title:'Simple3', component:$.UMLD3Simple003}
        ]}
    ]},
]

function buildItem(item) {
    if(item.children) {
        let subs = buildComponents(item.children)
        if(item.icon) {
            return (<SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
            {subs}
          </SubMenu>)
        } else {
            return (<SubMenu key={item.key} title={item.title}>
            {subs}
          </SubMenu>)
        }
    } else {
        if(item.icon) return (<Menu.Item key={item.key}><Icon type={item.icon} /><span>{item.title}</span></Menu.Item>)
        return (<Menu.Item key={item.key}>{item.title}</Menu.Item>)
    }
}
function buildComponents(confs) {
    return confs.map(item => {
        return buildItem(item)
    })
}

function buildRoutes(conf) {
    return conf.map(item => {
        if(item.children) {
            if(item.component) {
                return buildRoutes(item.children) + (<Route key={item.key} path={item.key} component={item.component} />)
            } else {
                return buildRoutes(item.children)
            }
        } else {
            if(item.component) {
                return (<Route key={item.key} path={item.key} component={item.component} />)
            }
        }
        return null
    })
}
function routes() {
    return (<Switch>
        <Route exact path='/main'  >
          <Redirect to='/main/charts' />
        </Route>
        {buildRoutes(navItems)}
      </Switch>)
}

export default {navConf:buildComponents(navItems), routes:routes()}
