
import {createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'
import reducer from '../Redux/Reducer'
import 'whatwg-fetch'

const store = createStore(reducer, {}, applyMiddleware(promiseMiddleware))

export function getStore() {
    return store
}
let _token

export function getToken() {
    if(!_token) {
        _token = store.getState().accountInfo.token
    }
    // return _token
    return store.getState().accountInfo.token
}

/* init = {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
} */
export function AFetch(input, init) {
    // getToken()
    if(!init) init = {}
    if(!init.headers) init.headers = {}
    if(getToken()) {
        init.headers.Authorization = getToken()
    }
    
    
    return fetch(input, init)
}
export function AFetchPost(input, body, init = {method:'post', headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
}}) {
    // getToken()
    if(!init) init = {}
    if(!init.headers) init.headers = {}
    if(getToken()) {
        init.headers.Authorization = getToken()
    }
    init.body = body
    return fetch(input, init)
}

export function AFetchJSON(input, init) {
    return AFetch(input, init).then(res => res.json()).catch(e => {
        return {code:1, msg:e}
    })
}

export function AFetchPostJson(input, body, init = {method:'post', headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
}}) {
    return AFetchPost(input, body, init).then(res => res.json()).catch(e => {
        return {code:1, msg:e}
    })
}