import React,{Component} from 'react';
import ChildClock from './ChildClock';

class Time extends Component {

  constructor(props) {
    super(props)
    this.state = {date:new Date()}
  }

  componentDidMount() {
    console.log('mount')
    this.timeID = setInterval(()=>this.tick(), 1000)
  }

  componentWillUnmount() {
    console.log('unmount')
    clearInterval(this.timeID)
  }

  render() {
    return (
      <div>
        <h1>Hello world</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <ChildClock time={this.state.date.toLocaleTimeString()} />
      </div>
    );
  }

  tick() {
    // console.log(this.setState)
    this.setState({date:new Date()})
  }
}

export default Time
