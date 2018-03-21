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
            <h1>ParentTimer</h1>
            <h2>Current Time is {this.state.time.toLocaleTimeString()}</h2>
            <ChildTimer date={this.state.time} />
        </div>)
    }

    componentDidMount() {
        this.timerID = setInterval(_=>{
            this.setState({time:new Date()})
        })
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }
}

export default ParentTimer