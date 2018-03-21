import React, {Component} from 'react'


class FormTest extends Component {
    constructor(props) {
        super(props)


        this.state = {
            name:'',
            selected:props.options[0]
        }
    }

    render() {
        const options = this.props.options
        const optionsJSX = options.map((opt, index) => (<option key={index} value={opt}>{opt}</option>))
        return (<form onSubmit={this.submitForm}>
            <input type='text' value={this.state.name} placeholder='input your name' onChange={this.onNameChange} />
            <select value={this.state.setecled} onChange={this.onSelectChange}>
                {optionsJSX}
            </select>
            <input type='submit' value='提交' />
        </form>)
    }

    submitForm = (e) => {
        alert(this.state.name + this.state.selected)
        e.preventDefault()
    }

    onNameChange = (e) => {
        this.setState({
            name:e.target.value
        })
    }

    onSelectChange = (e) => {
        this.setState({
            selected:e.target.value
        })
    }
} 

export default FormTest