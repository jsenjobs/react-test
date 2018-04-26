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
            radioValue: 0,
            useGroupBy: false,
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
                submitConf(values)
                form.resetFields()
                uuid = 0
                this.setState({radioValue: 0})
                this.add()
            }
        });
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
        const formItems = this.state.radioValue !== 2 ? keys.map((k, index) => {
        return (
            
                    <Row key={k} align="top" type="flex" justify="space-around">
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
                            {getFieldDecorator(`funcs[${k}]`, {
                                initialValue:'count',
                                rules: [{
                                required: true,
                                message: "统计方法",
                                }],
                            })(
                                <Select>
                                    <Option value="sum">求和(sum)</Option>
                                    <Option value="count">计数(count)</Option>
                                    <Option value="max">最大值(max)</Option>
                                    <Option value="min">最小值(min)</Option>
                                    <Option value="avg">均值(avg)</Option>
                                </Select>
                            )}
                            </FormItem>
                        </Col>
                        <Col span={spanW} style={{padding:0}}>
                            <FormItem
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                required={false}
                                key={k}
                            >
                            {getFieldDecorator(`columns[${k}]`, {
                                initialValue:'*',
                                rules: [{
                                required: true,
                                message: "分组字段",
                                }],
                            })(
                                <Select
                                showSearch
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                       {columns.map(c => <Option key={c} value={c}>{c}</Option>)}
                                </Select>
                            )}
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
        }): null
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
            {getFieldDecorator('calFunc', {
                initialValue:0,
            })(
                <RadioGroup onChange={this.radioChange}>
                    <Radio value={0}>分组统计</Radio>
                    <Radio value={1}>全表统计</Radio>
                    <Radio value={2}>数据去重</Radio>
                </RadioGroup>
            )}
            </FormItem>

            {this.state.radioValue !== 1 ? <FormItem  label="分组字段" /> : null}
            {this.state.radioValue !== 1 ? <Row align="middle" type="flex">
                <Col span={18}>
                <FormItem {...formItemLayout}>
                {
                    getFieldDecorator('groupColumns', {
                            initialValue: [],
                            rules: [{ required: true, message: '缺少分组字段', type: 'array' }],
                        })(
                            <Select mode='multiple' placeholder='选择分组字段'>
                                {columns.filter(i => i !== '*').map(c => <Option key={c}>{c}</Option>)}
                            </Select>
                    )}
                    </FormItem>
                </Col>
                <Col span={6} style={{textAlign:'center'}}>
                    {getFieldDecorator('useNotGroupColumn', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox onChange={e => {
                            this.setState({useGroupBy : e.target.checked})
                        }} />
                    )}
                </Col>
            </Row> : null}
            {this.state.useGroupBy ? 
                <FormItem {...formItemLayout}>
                {
                    getFieldDecorator('notGroupColumns', {
                            initialValue: [],
                            rules: [{ type: 'array' }],
                        })(
                            <Select mode='multiple' placeholder='选择非分组字段'>
                                {columns.filter(i => i !== '*').map(c => <Option key={c}>{c}</Option>)}
                            </Select>
                    )}
                    </FormItem> : null}
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
