import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { withCookies } from 'react-cookie'
import { withRouter} from 'react-router-dom'

export function requireAutnentication(Component) {
    if(Component.AuthenticatedComponent) {
        return Component.AuthenticatedComponent
    }

    class AuthenticatedComponent extends React.Component {
        state = {
            isLogin: false
        }
        componentWillMount() {
            this.checkAuth()
        }
        componentWillReceiveProps(nextProps) {
            this.checkAuth()
        }
        checkAuth = () => {
            const {accountInfo} = this.props
            let isLogin = accountInfo.code === 0 ? true : false

            if(!isLogin) {
                const { cookies } = this.props
                let username = cookies.get('_username')
                let password = cookies.get('_password')
                let token = cookies.get('_token')
                let rToken = cookies.get('_rToken')
                if(username && password && token && rToken) {
                    this.props.setIsLogin(username, token, rToken)
                    isLogin = true
                } else {
                    let redirect = this.props.location.pathname + this.props.location.search
                    this.props.history.push('/login?msg=401r&edirect_uri=' + encodeURIComponent(redirect))
                    return
                }
            }

            this.setState({isLogin})
        }

        render() {
            return this.state.isLogin ? (<Component {...this.props} />) : null
        }
    }

    function mapStateToProps(state) {
        return {
            accountInfo: state.accountInfo,
        }
    }
    
    function mapDispatchToProps(dispatch) {
        return {
            setIsLogin: (username, token, rToken) => dispatch({type:'SET_ACCOUNT_INFO', data:{code:0, username, token, rToken}}),
        }
    }

    Component.AuthenticatedComponent = withRouter(connect(mapStateToProps, mapDispatchToProps)(withCookies(AuthenticatedComponent)))
    return Component.AuthenticatedComponent
}
