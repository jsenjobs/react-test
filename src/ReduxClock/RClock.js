import React, {Component} from 'react'
import {createStore} from 'redux'


const reducer = (state = {now:new Date()}, action) => {
    return {now:new Date()}
}

const store = createStore(reducer)

class RClock extends Component {

    constructor(props) {
        super(props)
        store.subscribe(this.refresh)
    }
    render() {
        return (
            <div>
                Current time is {store.getState().now.toLocaleTimeString()}
            </div>
        )
    }

    refresh = () => {

    }

    componentDidMount() {
        this.timerID = setInterval(_=>{
            store.dispatch({type:'time'})
        })
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }
}

export default RClock