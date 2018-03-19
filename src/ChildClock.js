import React, { Component } from 'react';

class ChildClock extends Component {
  render() {
    return (<div onClick={this.childClockClick}>child time is {this.props.time}</div>)
  }

  childClockClick(e) {
    e.preventDefault()
    console.log(e)
    // alert('click')
  }
}
export default ChildClock
