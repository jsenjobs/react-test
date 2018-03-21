import React, {Component} from 'react'

// 测试ref
class RefTest extends Component {
    render() {
        return <div>
            <input ref={input => this.domInput = input} type='text' />
            <button onClick={this.getValueClick} >getValue</button>
        </div>
    }

    getValueClick  = () => {
        // console.log(this.domInput)
        alert(this.domInput.value)
    }
}

export default RefTest