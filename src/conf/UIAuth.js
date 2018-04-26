
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {AFetchJSON, getStore} from '../utils/AFetch'
import Apis from '../Api/Apis'

export let wrapAuth = (ComposedComponent) => class WrapComponent extends Component {
    state = {
        permission: false,
    }
    // 构造
    constructor(props) {
      super(props)
    }
    componentWillMount() {
        if(this.state.permission) {
            return
        }
        if(this.props.permissions) {


            let key = JSON.stringify(this.props.permissions)
            let has = getStore().getState().httpData_authInfos[key]
            if(has === true) {
                this.setState({permission: true})
                return
            } else if(has === false) {
                this.setState({permission: false})
                return
            }

            AFetchJSON(Apis.auth.hasPermissions + key).then(json => {
                if(json.code === 0) {
                    this.setState({permission:true})
                    getStore().dispatch({type:'HTTP_DATA_AUTH_INFOS_SET', data:{key:key, value:true}})
                } else {
                    this.setState({permission:false})
                    getStore().dispatch({type:'HTTP_DATA_AUTH_INFOS_SET', data:{key:key, value:false}})
                }
            })
        } else {
            this.setState({permission:true})
        }
    }

    render() {
        return this.state.permission ? <ComposedComponent  { ...this.props} /> : this.props.unAuth ? this.props.unAuth : null
    }
}

// permission is permissions
export let wrapAuthPermission = (ComposedComponent, permission, fetching, unAuth) => class WrapComponent extends Component {
    state = {
        isFetching: true,
        permission: false,
    }
    // 构造
    constructor(props) {
      super(props)
    }

    componentWillMount() {
        if(this.state.permission) {
            return
        }
        if(permission) {
            let key = JSON.stringify(permission)
            let has = getStore().getState().httpData_authInfos[key]
            if(has === true) {
                this.setState({permission: true, isFetching: false})
                return
            } else if(has === false) {
                this.setState({permission: false, isFetching: false})
                return
            }

            AFetchJSON(Apis.auth.hasPermissions + key).then(json => {
                if(json.code === 0) {
                    this.setState({permission:true, isFetching: false})
                    getStore().dispatch({type:'HTTP_DATA_AUTH_INFOS_SET', data:{key:key, value:true}})
                } else {
                    this.setState({permission:false, isFetching: false})
                    getStore().dispatch({type:'HTTP_DATA_AUTH_INFOS_SET', data:{key:key, value:false}})
                }
            })
        } else {
            this.setState({permission:true})
        }
    }

    render() {
        if(this.state.isFetching) {
            return fetching
        }
        return (this.state.permission) ? <ComposedComponent  { ...this.props} /> : unAuth
    }
}