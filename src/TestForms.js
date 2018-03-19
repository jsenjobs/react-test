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
      <input value='Submit00' />
      <select value={this.state.selected} onChange={this.onSelectChanged}>
        <option value='Item1'>Item1</option>
        <option value='Item2'>Item2</option>
        <option value='Item3'>Item3</option>
        <option value='Item4'>Item4</option>
      </select>
      </form>)
  }

  submit = (e) => {
    alert('default form submit:' + this.state.name)
    e.preventDefault()
  }
  onNameChange = e => {
    this.setState({name:e.target.value})
  }
  onSelectChanged = e => {
    this.setState({
      selected:e.target.value
    })
  }
}

export default TestForm
