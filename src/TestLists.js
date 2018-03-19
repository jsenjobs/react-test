import React, {Component} from 'react';

class TestList extends Component {
  constructor(props) {
    super(props)
    this.listItems = props.datas.map((data, index) => <li key={index}>{data}</li>)
  }
  render() {
    return (<ul>{this.listItems}</ul>)
  }
}

export default TestList
