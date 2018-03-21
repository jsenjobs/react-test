import React, {Component} from 'react'

// 测试事件中的参数传递
class ParametersTest extends Component {

    constructor(props) {
        super(props)

        this.state = {
            ToggleON:false
        }
    }


    render() {
        return <div>
            <button onClick={this.toggle}>
            {this.state.ToggleON?'ON':'OFF'}
            </button>
            <button onClick={e => {this.eventA('p1', 'p2', e)}} >BT1</button>
            <button onClick={this.eventA.bind(this, 'p3', 'p4')} >BT2</button>
        </div>
    }

    toggle = (e) => {
        this.setState(preState => ({
            ToggleON:!preState.ToggleON
        }))
    }

    eventA(p1, p2, e) {
        alert('eventA:' + p1 + " " + p2)
    }
}

export default ParametersTest