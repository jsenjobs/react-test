import React, {Component} from 'react'
import {connect} from 'react-redux'

class RClock extends Component {

    render() {
      const {clock} = this.props
        return (
            <div>
                Clock use redux, Current time is {clock.toLocaleTimeString()}
            </div>
        )
    }

    componentDidMount() {
        const onUpdate = this.props.onUpdate
        this.timerID = setInterval(_=>{
            onUpdate()
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }
}

function mapStateToProps(state) {
  return {
    clock:state.clock
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onUpdate:() => dispatch({type:'TIME'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RClock)
