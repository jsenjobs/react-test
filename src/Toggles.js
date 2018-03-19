import React,{Component} from 'react';

class Toggle extends Component {

  constructor(props) {
    super(props)
    this.state = {isToggleOn:true}

    this.handleClick = this.handleClick.bind(this)
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick2}>
        {this.state.isToggleOn ? 'ON': 'OFF'}
        </button>
        <button onClick={this.testEvent1.bind(this, 1, 3)}>event1</button>
        <button onClick={e => {this.testEvent1(2,4, e)}}>event1</button>
      </div>
    )
  }

  handleClick() {
    this.setState(preState => ({
      isToggleOn: !preState.isToggleOn
    }))
  }

  handleClick2 = () => {
    this.setState(preState => ({
      isToggleOn: !preState.isToggleOn
    }))
  }

  testEvent1(id, event) {
    console.log(id)
    console.log(event)
  }
}

export default Toggle
