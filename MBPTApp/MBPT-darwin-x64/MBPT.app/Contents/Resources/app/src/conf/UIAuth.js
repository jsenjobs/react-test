
import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {AFetch} from '../utils/AFetch'
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
            AFetch(Apis.auth.hasPermissions + JSON.stringify(this.props.permissions)).then(res => res.json()).then(json => {
                this.setState({permission:json.code === 0})
            }).catch(e => this.setState({permission: false}))
        } else {
            this.setState({permission:true})
        }
    }

    render() {
        return this.state.permission ? <ComposedComponent  { ...this.props} /> : this.props.unAuth ? this.props.unAuth : null
    }
}

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
            AFetch(Apis.auth.hasPermissions + JSON.stringify(permission)).then(res => res.json()).then(json => {
                this.setState({permission:json.code === 0, isFetching: false})
            }).catch(e => this.setState({permission: false}))
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