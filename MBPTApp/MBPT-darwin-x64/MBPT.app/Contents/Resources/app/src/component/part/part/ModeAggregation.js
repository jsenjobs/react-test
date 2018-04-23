import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select
let uuid = 0
class ModeAggregation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currency:{},
            radioValue:1,
            groupBy:[],// 分组字段
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
        let {submitConf, form} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                form.resetFields()
                this.add()
                submitConf(values)
            }
        });
    }
    handleCurrencyChange = (k, attr, value) => {
        let state = this.state
        state.currency[k][attr] = value
        this.setState(state)
    }
    radioChange = (e) => {
        this.setState({
            radioValue: e.target.value
        })
    }
    componentDidMount() {
        this.add()
    }
    componentWillReceiveProps(newProps) {
        if(this.props.visible && !newProps.visible) {
            this.props.form.resetFields()
            this.add()
        }
    }
    render() {
        const { columns } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        const formItemLayoutWithOutLabel = {}
        getFieldDecorator('keys', { initialValue: [] })
        const keys = getFieldValue('keys')
        let spanW = keys.length > 1 ? 6 : 7
        const formItems = keys.map((k, index) => {
            let key = k + 'ss'
            if(!this.state.currency[key]) this.state.currency[key] = {}
            if(!this.state.currency[key].method) this.state.currency[key].method = 'count'
            if(!this.state.currency[key].columns) this.state.currency[key].columns = '*'
        return (
            
                    <Row align="top" type="flex" justify="space-around">
                        <Col span={spanW} span={spanW} style={{padding:0}}>
                        <FormItem
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            required={false}
                            key={k}
                        >
                            {getFieldDecorator(`names[${k}]`, {
                                rules: [{
                                required: true,
                                message: "请输入统计名",
                                }],
                            })(
                                <Input placeholder="统计名" />
                            )}
                        </FormItem>
                        </Col>
                        <Col span={spanW} span={spanW} style={{padding:0}}>
                            <FormItem
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                required={false}
                                key={k}
                            >
                                {
                                <Select
                                    value={this.state.currency[key].method}
                                    onChange={value => this.handleCurrencyChange(key, 'method', value)}
                                >
                                    <Option value="sum">求和(sum)</Option>
                                    <Option value="count">计数(count)</Option>
                                    <Option value="max">最大值(max)</Option>
                                    <Option value="min">最小值(min)</Option>
                                    <Option value="avg">均值(avg)</Option>
                                </Select>
                                }
                            </FormItem>
                        </Col>
                        <Col span={spanW} style={{padding:0}}>
                            <FormItem
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                required={false}
                                key={k}
                            >
                                {
                                <Select
                                    showSearch
                                    value={this.state.currency[key].columns}
                                    onChange={value => this.handleCurrencyChange(key, 'columns', value)}
                                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {columns.map(c => <Option key={c} value={c}>{c}</Option>)}
                                </Select>
                                }
                            </FormItem>
                        </Col>

                        <Col span={3} style={{padding:0, textAlign:'center'}}>
                            <FormItem
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            >
                            <Button onClick={_ => this.add()} style={{width:32, textAlign:'center', padding:0}} ><Icon type='plus' /></Button>
                            </FormItem>
                        </Col>
                        {
                            keys.length > 1 ? (<Col span={3} style={{padding:0, textAlign:'center'}}>
                            <FormItem
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            >
                            <Button onClick={_ => this.remove(k)} disabled={keys.length === 1} style={{width:32, textAlign:'center', padding:0}} ><Icon type='minus-circle-o' /></Button>
                            </FormItem>
                            </Col>) : null
                        }
                    </Row>
            )
        });
        return (
        <Form onSubmit={this.handleSubmit} id='self-cal-agg'>
            <FormItem label="结果集中文名" {...formItemLayout}>
            {getFieldDecorator('resultCollectionName', {
                rules: [{ required: true, message: '请输入结果集名字' }],
            })(
                <Input placeholder="步骤结果1" />
            )}
            </FormItem>
            <FormItem  label="运算方式" {...formItemLayout}>
            {
                <RadioGroup onChange={this.radioChange} value={this.state.radioValue}>
                    <Radio value={1}>分组统计</Radio>
                    <Radio value={2}>全表统计</Radio>
                    <Radio value={3}>数据去重</Radio>
              </RadioGroup>
            }
            </FormItem>
            <FormItem  label="分组字段" />
            <Row align="middle" type="flex">
                <Col span={18}>
                <FormItem {...formItemLayout}>
                {
                    getFieldDecorator('groupColumn', {
                            initialValue: ['*'],
                            rules: [{ required: true, message: '缺少分组字段', type: 'array' }],
                        })(
                            <Select mode='multiple' placeholder='选择分组字段'>
                                {columns.map(c => <Option key={c}>{c}</Option>)}
                            </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} style={{textAlign:'center'}}>
                    {getFieldDecorator('useGroupBy', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox />
                    )}
                </Col>
            </Row>
            
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
function mapStateToProps(state) {
    return {
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        submitConf: (conf) => dispatch({type:'ON_GET_MODEL_WORK_CONF', data:{type:'ModeAggregation', data:conf}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ModeAggregation))  
