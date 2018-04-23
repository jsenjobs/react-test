import React, {Component} from 'react'
import { Button } from 'antd';
import 'antd/dist/antd.css'

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
            <Button onClick={this.toggle} type='danger' ghost>
            {this.state.ToggleON?'ON':'OFF'}
            </Button>
            <Button onClick={e => {this.eventA('p1', 'p2', e)}}  type='danger' ghost>BT1</Button>
            <Button onClick={this.eventA.bind(this, 'p3', 'p4')}  type='danger' ghost>BT2</Button>
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