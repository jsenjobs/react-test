import { Menu, Icon, Card, Col} from 'antd'
import React from 'react'
import {Route, Switch, Redirect, Link} from 'react-router-dom';

import {wrapAuth, wrapAuthPermission} from './UIAuth'

import {uuid} from '../utils/UUID'

import $ from '../Route'
import COM from '../component'


const {SubMenu} = Menu

const navItems = [
    {key:'/main/dashboard', icon:'appstore', title:'主面板', component:COM.DashBoard, permissions:['sys:ui:dashboard']},
    {key:'/main/resourcesearch', icon:'search', title:'搜索资源', component:COM.ResourceSearch, permissions:['sys:ui:resourcesearch'], showInDashBoard:true},
    {key:'/model/edit', icon:'line-chart', title:'数据建模', component:COM.ModelEdit, permissions:['sys:ui:dataModel'], showInDashBoard:true},
    {key:'/main/modeshare', icon:'bar-chart', title:'模型库', component:COM.ModelShare, permissions:['sys:ui:modelCenter'], showInDashBoard:true,
    inner:{key:'/main/modeshare/exec/:id', component: COM.ModelExec, permissions:['sys:ui:modelCenter']}},
    {key:'sys', icon:'setting', title:'系统管理', children:[
        // {key:'/main/ajax/show/users', title:'用户List', component:COM.ShowUsers},
        {key:'auth', title:'权限管理', children:[
            {key:'/main/sys/auth/user', title:'用户管理', component:COM.User, permissions:['sys:ui:auth:user'], showInDashBoard:true}, 
            {key:'/main/sys/auth/role', title:'角色管理', component:COM.Role, permissions:['sys:ui:auth:role'], showInDashBoard:true}, 
            {key:'/main/sys/auth/permission', title:'权限管理', component:COM.Permission, permissions:['sys:ui:auth:permission'], showInDashBoard:true}, 
            {key:'/main/sys/auth/api', title:'Api配置', component:COM.Api, permissions:['sys:ui:auth:api'], showInDashBoard:true}, 
        ], permissions:['sys:ui:authMenu']},
        {key:'data', title:'数据管理', children:[
            {key:'/main/sys/data/table', title:'数据表管理', component:COM.TableManage, permissions:['sys:ui:data:table'], showInDashBoard:true}, 
            {key:'/main/sys/data/topic', title:'主题管理', component:COM.Topic, permissions:['sys:ui:data:topic'], showInDashBoard:true}, 
        ], permissions:['sys:ui:dataMenu']},
        {key:'/main/sys/logs', title:'日志管理', component:COM.ShowUsers, permissions:['sys:ui:data:log'], showInDashBoard:true},
    ], permissions:['sys:ui:system']},
    {key:'/main/charts', icon:'pie-chart', title:'ECharts', component:$.PageEcharts, permissions:['sys:ui:dev']},
    {key:'sub1', icon:'pie-chart', title:'D3.js', children:[
        {key:'/main/dg/d3/simple1', title:'简单实例', component:$.UMLD3Simple001}, 
        {key:'/main/dg/d3/simple2', title:'力导向图1', component:$.UMLD3Simple002}, 
        {key:'/main/dg/d3/simple3', title:'思维导图', component:$.UMLD3Simple003}, 
        {key:'/main/dg/d3/simple4', title:'柱状图', component:$.UMLD3Simple004}, 
        {key:'/main/dg/d3/simple5', title:'面积图', component:$.UMLD3Simple005}, 
        {key:'/main/dg/d3/simple6', title:'饼图', component:$.UMLD3Simple006}, 
        {key:'/main/dg/d3/simple7', title:'径向堆栈柱状图', component:$.UMLD3Simple007}, 
        {key:'/main/dg/d3/simple8', title:'单弦图', component:$.UMLD3Simple008}, 
        {key:'/main/dg/d3/simple9', title:'打包图', component:$.UMLD3Simple009}, 
        {key:'/main/dg/d3/simple10', title:'雷达图', component:$.UMLD3Simple0010}, 
        {key:'/main/dg/d3/simple11', title:'力导向图', component:$.UMLD3Simple0011}, 
        {key:'/main/dg/d3/simple12', title:'中国地图', component:$.UMLD3Simple0012}
    ], permissions:['sys:ui:dev']},
    /*
    {key:'/main/d3', icon:'pie-chart', title:'D3', component:$.D3Charts}, 
    {key:'/main/page1', icon:'desktop', title:'测试1', component:$.Page1}, 
    {key:'/main/page2', icon:'inbox', title:'Redux', component:$.Page2},
    {key:'sub2', icon:'maile', title:'组1',children:[
        {key:'/main/g1/editor', title:'编辑器', component: $.Editor}, 
        {key:'/main/g1/page1', title:'Option 6'}, 
        {key:'/main/g1/page2', title:'Option 7'}, 
        {key:'/main/g1/page3', title:'Option 8'}
    ]},
    {key:'sub3', icon:'appstore', title:'DG',children:[
        {key:'/main/dg/charts1', title:'Option 9'}, 
        {key:'/main/dg/page6', title:'otion 10'},
        {key:'ssub1', title:'GOJS', children:[
            {key:'/main/dg/gojs/simple1', title:'Simple1', component:$.UMLGOJSSimple1}, 
            {key:'/main/dg/gojs/simple2', title:'Simple2', component:$.UMLGOJSSimple2}, 
            {key:'/main/dg/gojs/simple3', title:'Simple3', component:$.UMLGOJSSimple3}
        ]}
    ]},
    */
]

function initPermissions(conf, headPermissions) {
    conf.forEach(c => {
        if(!c.permissions) c.permissions = []
        c.permissions = [...c.permissions, ...headPermissions]
        if(c.children) {
            initPermissions(c.children, c.permissions)
        }
    })
}
initPermissions(navItems, [])
const AuthSubMenu = wrapAuth(SubMenu)
const AuthSubMenuItem = wrapAuth(Menu.Item)
const AuthLink = wrapAuth(Link)
function buildItem(item) {
    if(item.children) {
        let subs = buildComponents(item.children)
        if(item.icon) {
            paths[item.key] = true
            return (<AuthSubMenu permissions={item.permissions} key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
            {subs}
          </AuthSubMenu>)
        } else {
            paths[item.key] = true
            return (<AuthSubMenu permissions={item.permissions} key={item.key} title={item.title}>
            {subs}
          </AuthSubMenu>)
        }
    } else {
        if(item.icon) {
            paths[item.key] = true
            return (<AuthSubMenuItem permissions={item.permissions} key={item.key}><Icon type={item.icon} /><span>{item.title}</span></AuthSubMenuItem>)
        }
        paths[item.key] = true
        return (<AuthSubMenuItem permissions={item.permissions} key={item.key}>{item.title}</AuthSubMenuItem>)
    }
}
function buildComponents(confs) {
    return confs.map(item => {
        return buildItem(item)
    })
}

// <Route key={item.key} path={item.key} component={AC} />
// {key:'/main/modeshare', icon:'bar-chart', title:'模型库', component:COM.ModelShare, permissions:['sys:ui:modelCenter'], showInDashBoard:true},
function buildRoutes(conf) {
    const result = conf.map(item => {
        if(item.children) {
            console.log(item.component)
            if(item.component) {
                console.log(1)
                let AC = wrapAuthPermission(item.component, item.permissions, <div>正在加载权限</div>, <div>没有访问权限</div>)
                return buildRoutes(item.children) + (<Route key={item.key} path={item.key} component={AC} />)
            } else {
                console.log(2)
                return buildRoutes(item.children)
            }
        } else {
            if(item.component) {
                if(!item.inner) {
                    let AC = wrapAuthPermission(item.component, item.permissions, <div>正在加载权限</div>, <div>没有访问权限</div>)
                    return (<Route key={item.key} path={item.key} component={AC} />)
                } else {
                    let inner = item.inner
                    let ACInner = wrapAuthPermission(inner.component, inner.permissions, <div>正在加载权限</div>, <div>没有访问权限</div>)
                    let AC = wrapAuthPermission(item.component, item.permissions, <div>正在加载权限</div>, <div>没有访问权限</div>)
                    return [<Route key={inner.key} path={inner.key} component={ACInner} />, <Route key={item.key} path={item.key} component={AC} />]
                }
            }
        }
        return null
    })
    console.log(result)
    return result
}
function routes() {
    let AC = wrapAuthPermission(COM.ModelExec, ['sys:ui:modelCenter'], <div>正在加载权限</div>, <div>没有访问权限</div>)
    
    return (<Switch>
        <Route exact path='/main'  >
          <Redirect to='/main/dashboard' />
        </Route>
        {buildRoutes(navItems)}
        <Route path='/main/sys/auth**'  >
          <Redirect to='/main/sys/auth/user' />
        </Route>
        <Route path='/main/sys/data**'  >
          <Redirect to='/main/sys/data/table' />
        </Route>
        <Route path='/main/sys**'  >
          <Redirect to='/main/sys/auth/user' />
        </Route>
        <Route path='/main**'  >
          <Redirect to='/main/dashboard' />
        </Route>
        <Route path='**'  >
          <Redirect to='/main/dashboard' />
        </Route>
      </Switch>)
}

let paths = {}
function getKey(path, oldKey) {
    if(path.startsWith('/main/modeshare')) {
        return '/main/modeshare'
    }
    if(paths[path]) {
        return path
    }
    return oldKey
}

export default {navConf:buildComponents(navItems), routes:routes(), getKey: getKey}

export function genDashFunctions() {
    function getComponent(items) {
        let cpmps = []
        items.forEach(item => {
            if(item.showInDashBoard) {
                cpmps.push(<Col span="8"><AuthLink to={item.key} permissions={item.permissions}><Card>{item.title}</Card></AuthLink></Col>)
            }
            if(item.children) {
                cpmps.push(...getComponent(item.children))
            }
        })
        return cpmps
    }

    return getComponent(navItems)
}
