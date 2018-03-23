import React, {Component} from 'react'

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
            <input ref={input => this.domInput = input} type='text' />
            <button onClick={this.getValueClick} >getValue</button>
        </div>
    }

    getValueClick() {
        alert(this.domInput.value)
    }
    /*
    getValueClick  = () => {
        // console.log(this.domInput)
        alert(this.domInput.value)
    }*/
}

export default RefTest