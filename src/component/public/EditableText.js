import React, {Component} from 'react'
import {Card, Row, Col, Popover, Input, Button} from 'antd'

class App extends Component {
    state = {
        value: '',
        isEdit: false,
    }
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const {defaultValue} = this.props
        if(defaultValue) {
            this.setState({value:defaultValue})
        }
    }
    render() {

        const {placeholder, preText} = this.props

        const node = this.state.isEdit ? <Button style={{width:'auto'}} size='small' onClick={this.onSave} type='primary' >保存</Button> : <Button style={{width:'auto'}} size='small' onClick={this.onEdit} >编辑</Button>

        return <div style={{display:'flex'}}>
        {preText}
                <Input style={{flex:1, minWidth:100}} size='small' disabled={!this.state.isEdit} placeholder={placeholder} value={this.state.value} onChange={this.change} />
                {node}
        </div>


    }

    change = (e) => {
        this.setState({value: e.target.value})
    }
    onSave = () => {
        if(this.props.onChange) {
            if(this.props.onChange(this.state.value)) {
                this.setState({isEdit: false})
            } else {
                this.setState({isEdit: false, value: this.props.defaultValue})
            }
        } else {
            this.setState({isEdit: false})
        }
    }
    onEdit = () => {
        this.setState({isEdit: true})
    }
}

export default App