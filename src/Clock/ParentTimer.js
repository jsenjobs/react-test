import React,{Component} from 'react';
import ChildTimer from './ChildTimer'


// 测试状态， 测试父组件状态向子组件传递（props）
class ParentTimer extends Component {

    constructor(props) {
        super(props)
        this.state = {time:new Date()}
    }
    render() {
        return (<div>
            <h1>Use react state and props</h1>
            <h2>ParentTimer Current Time is {this.state.time.toLocaleTimeString()}</h2>
            <ChildTimer date={this.state.time} />
        </div>)
    }

    componentDidMount() {
        this.timerID = setInterval(_=>{
            this.setState({time:new Date()})
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }
}

export default ParentTimer