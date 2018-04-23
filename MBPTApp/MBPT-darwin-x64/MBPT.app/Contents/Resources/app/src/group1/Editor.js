import ReactQuill from 'react-quill'

import React, {Component} from 'react'
import 'react-quill/dist/quill.snow.css'
class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
      }
     
      handleChange(value) {
        this.setState({ text: value })
      }
      
    render() {
        return (
            <div>
                <ReactQuill value={this.state.text}
                  onChange={this.handleChange} />
                  
                  <div>the html content:<br/>{this.state.text}</div>
            </div>
        )
    }
}

export default Editor