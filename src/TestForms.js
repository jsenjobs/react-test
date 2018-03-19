import React,{Component} from 'react';

class TestForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name:'jsen'
    }
  }
  render() {
    return  (<form onSubmit={this.submit}>
      <input type='text' value={this.state.name} onChange={this.onNameChange} />
      <input type='submit' value='Submit' />
      </form>)
  }

  submit = (e) => {
    alert('default form submit:' + this.state.name)
    e.preventDefault()
  }
  onNameChange = e => {
    this.setState({name:e.target.value})
  }
}

export default TestForm
