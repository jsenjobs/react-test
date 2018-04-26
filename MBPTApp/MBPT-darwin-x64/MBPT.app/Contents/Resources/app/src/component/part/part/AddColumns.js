import React, {Component} from 'react'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader, AutoComplete} from 'antd'
import {connect} from 'react-redux'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select
let uuid = 0
const funcDataSource = [
    'CONCAT', 'REPLACE', 'SUBSTRING'
]
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currency:{},
            radioValue:1,
            dyDataSource:funcDataSource,
        }

    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }
    
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let {submitConf} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                submitConf(values)
            }
        });

        this.currentFunc = null
    }
    handleCurrencyChange = (k, attr, value) => {
        let state = this.state
        state.currency[k][attr] = value
        this.setState(state)
    }
    radioChange = (e) => {
        alert(e.target.value)
        this.setState({
            radioValue: e.target.value
        })
    }
    componentDidMount() {
        this.add()
    }

    onAutoFuncChange = (value) => {
        if(!value || value.length === 0) {
            this.currentFunc = null
            this.setState({dyDataSource: funcDataSource})
            return
        }
        if(this.isFinish(value)) {
            this.setState({dyDataSource: []})
            return
        }
        if(funcDataSource.indexOf(value) >= 0) {
            this.currentFunc = value
            // changeDataSource
            value = value + '('
        } else {
            if(value.trim().endsWith('(')) {
                if(funcDataSource.indexOf(value.trim().substring(0, value.trim().length - 1)) < 0) {
                    if(
                        value.indexOf('(') !== value.lastIndexOf('(')
                    ) {
                        value = value + '), '
                    } else {
                        value = value + ', '
                    }
                }
            } else {
                value = value + ', '
            }
        }

        let newDs = this.props.columns.map(item => value + item)
        if(value.endsWith(', ')) {
            newDs.splice(0, 0, value.substring(0, value.length - 2) + ')')
        } else {
            newDs.splice(0, 0, value + ')')
        }
        newDs.push(value + 'GETDATE()')
        this.setState({dyDataSource: newDs})
    }
    isFinish = (str) => {
        let f = 0
        let has = false
        for(let i = 0; i < str.length; i++) {
            if(str[i] === '(') {
                f++
                has = true
            } else if(str[i] === ')') {
                f--
                has = true
            }
        }
        return has && f === 0
    }
    spliceBase = (str) => {
        let id = str.lastIndexOf(',')
        if(id >= 0) {
            return str.substring(0, id)
        }
        id = str.indexOf('(')
        if(id >= 0) {
            return str.substring(0, id)
        }
        return str
    }
    componentWillReceiveProps(newProps) {
        if(this.props.visible && !newProps.visible) {
            this.props.form.resetFields()
            this.setState({dyDataSource: funcDataSource})
            this.currentFunc = null
            this.add()
        }
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        const formItemLayoutWithOutLabel = {}
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            let spanW = keys.length > 1 ? 18: 21
            let key = k + 'ss'
            if(!this.state.currency[key]) this.state.currency[key] = {}
            if(!this.state.currency[key].method) this.state.currency[key].method = 'count'
            if(!this.state.currency[key].columns) this.state.currency[key].columns = '*'
        return (
            <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                required={false}
                key={k}
            >
            
                    <Row>
                        <Col span={spanW} span={spanW / 3} style={{padding:0}}>
                        {getFieldDecorator(`names[${k}]`, {
                            rules: [{
                            required: true,
                            message: "请输入新增字段名",
                            }],
                        })(
                            <Input placeholder="新增字段" />
                        )}
                        </Col>
                        <Col span={spanW} span={spanW * 2 / 3} style={{padding:0}}>
                            {getFieldDecorator(`funcs[${k}]`, {
                                rules: [{
                                required: true,
                                message: "请输入新增字段表达式",
                                }],
                            })(
                                <AutoComplete 
                                onChange={this.onAutoFuncChange} 
                                dataSource={this.state.dyDataSource} 
                                placeholder="新增字段表达式， 如(max(score))"
                                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                 />
                            )}
                        </Col>

                        <Col span={3} style={{padding:0, textAlign:'center'}}>
                            <Button onClick={_ => this.add()} style={{width:32, textAlign:'center', padding:0}} ><Icon type='plus' /></Button>
                        </Col>
                        {
                            keys.length > 1 ? (<Col span={3} style={{padding:0, textAlign:'center'}}>
                            <Button onClick={_ => this.remove(k)} disabled={keys.length === 1} style={{width:32, textAlign:'center', padding:0}} ><Icon type='minus-circle-o' /></Button>
                            </Col>) : null
                        }
                    </Row>
                </FormItem>
            );
        });
        return (
        <Form onSubmit={this.handleSubmit} id='self-cal-add'>
            <FormItem label="结果集中文名" {...formItemLayout}>
            {getFieldDecorator('resultCollectionName', {
                rules: [{ required: true, message: '请输入结果集名字' }],
            })(
                <Input placeholder="步骤结果1" />
            )}
            </FormItem>
            {formItems}
            <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
                确定
            </Button>
            </FormItem>
        </Form>
        );
    }
}
    
App.defaultProps = {
    columns: [
        'id','name','sex'
    ]
}

function mapStateToProps(state) {
    return {
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        submitConf: (conf) => dispatch({type:'ON_GET_MODEL_WORK_CONF', data:{type:'AddColumns', data:conf}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(App))  
