import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader, AutoComplete} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select
class ModeAggregation extends React.Component {
    constructor(props) {
        super(props)

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {submitConf, type} = this.props
                submitConf(values, type)
            }
        });
    }
    componentWillReceiveProps(newProps) {
        if(newProps.type !== this.props.type) {
            this.props.form.resetFields()
        }
    }
    render() {
        const {ColumnSelect, RightColumnSelect, DisableSelect, ShowSelect, columns1, columns2} = this.props
        const opt1 = columns1.map(item => <Option value={item}>{item}</Option>)
        const opt2 = columns2.map(item => <Option value={item}>{item}</Option>)
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        let iW = ShowSelect ? 10 : 12
        let sW = 24 - iW * 2
        return (
        <Form onSubmit={this.handleSubmit} id='self-cal-add'>
            <Row>
                <Col span={12} style={{background:'#dddddd',textAlign:'center'}}>表1要显示的列</Col>
                <Col span={12} style={{background:'#ddd',textAlign:'center'}}>表2要显示的列</Col>
            </Row>
            {ColumnSelect ? (<Row>
                <Col span={12}>
                <FormItem
                {...formItemLayout}
                >
                {getFieldDecorator('table1Show', {
                    rules: [
                    { required: true, message: '请选择表1要显示的属性', type: 'array' },
                    ],
                })(
                    <Select mode='multiple' placeholder="选择表1要显示的属性">
                        {opt1}
                    </Select>
                )}
                </FormItem>
                </Col>
                {RightColumnSelect ? (<Col span={12}>
                    <FormItem
                    {...formItemLayout}
                    >
                    {getFieldDecorator('table2Show', {
                        rules: [
                        { required: true, message: '请选择表2要显示的属性', type: 'array' },
                        ],
                    })(
                        <Select mode='multiple' placeholder="选择表2要显示的属性">
                            {opt2}
                        </Select>
                    )}
                    </FormItem>
                </Col>) : null}
            </Row>):null}

            
            <Row>
                <Col span={iW}>
                    <FormItem>
                        {getFieldDecorator('table1Column', {
                            rules: [{ required: true, message: '请输入表一比较字段' }],
                        })(
                            <AutoComplete dataSource={columns1} placeholder="字段1" />
                        )}
                    </FormItem>
                </Col>
                {
                    ShowSelect ? (<Col span={sW}>
                        <FormItem
                        hasFeedback={!DisableSelect}
                        >
                        {getFieldDecorator('func', {
                            initialValue: 'eq',
                            rules: [
                            { required: true, message: '请选择比较操作' },
                            ],
                        })(
                            <Select disabled={DisableSelect}>
                                <Option value="eq">=</Option>
                                <Option value="gt">&gt;</Option>
                                <Option value="lt">&lt;</Option>
                                <Option value="gteq">&gt;=</Option>
                                <Option value="lteq">&lt;=</Option>
                                <Option value="noteq">!=</Option>
                            </Select>
                        )}
                        </FormItem>
                    </Col>):null
                }
                
                <Col span={iW}>
                    <FormItem>
                        {getFieldDecorator('table2Column', {
                            rules: [{ required: true, message: '请输入表二比较字段' }],
                        })(
                            <AutoComplete dataSource={columns2} placeholder="字段2" />
                        )}
                    </FormItem>
                </Col>
                
            </Row>
            <FormItem>
            <Button type="primary" htmlType="submit" className="join-submit-button">
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
        submitConf: (conf, type) => dispatch({type:'ON_GET_MODEL_WORK_CONF', data:{type:type, data:conf}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ModeAggregation)) 
