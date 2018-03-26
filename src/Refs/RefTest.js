import React, {Component} from 'react'
import { Button, Input } from 'antd';
import 'antd/dist/antd.css'

// 测试ref
class RefTest extends Component {

    constructor(props) {
        super(props)
        this.getValueClick = this.getValueClick.bind(this)
    }
    render() {
        return <div>
            <h1>Refs test</h1>
            <h1>Refs test1</h1>
            <Input ref={input => this.domInput = input} type='text' />
            <Button onClick={this.getValueClick} type='primary'>getValue</Button>
        </div>
    }

    getValueClick() {
        alert(this.domInput.input.value)
    }
    /*
    getValueClick  = () => {
        // console.log(this.domInput)
        alert(this.domInput.value)
    }*/
}

export default RefTest