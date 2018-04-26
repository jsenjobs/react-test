import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader, AutoComplete} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select
let uuid = 0
class ModeAggregation extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {submitConf, type, form, sourceTableName, targetTableName} = this.props
                values.sourceTableName = sourceTableName
                values.targetTableName = targetTableName
                console.log(values)
                submitConf(values, type)
                form.resetFields()
                uuid = 0
                this.add()
            }
        });
    }
    componentDidMount() {
        this.add()
    }
    componentWillReceiveProps(newProps) {
        // 切换modal页面， 重置数据
        if(newProps.type !== this.props.type) {
            this.props.form.resetFields()
            this.add()
        }
        if(this.props.visible && !newProps.visible) {
            this.props.form.resetFields()
            this.add()
        }
    }
    add = () => {
        
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        console.log(keys)
        const nextKeys = keys.concat(uuid);
        console.log(nextKeys)
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
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
    render() {
        const {ColumnSelect, RightColumnSelect, DisableSelect, ShowSelect, columns1, columns2} = this.props
        const opt1 = columns1.map(item => <Option value={item}>{item}</Option>)
        const opt2 = columns2.map(item => <Option value={item}>{item}</Option>)
        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        // show select len = 1    7*3 3
        // show select len > 1    6*3 3*2
        // dis len = 1 10.5 * 2 3
        // dis len > 1 9 * 2  3 * 2
        const formItemLayoutWithOutLabel = {}
        getFieldDecorator('keys', { initialValue: [] })
        const keys = getFieldValue('keys')
        let len = keys.length
        let iW
        if(ShowSelect) {
            iW = len > 1 ? 6 : 7
        } else {
            iW = len > 1 ? 8 : 10
        }

        const formItems = keys.map((k, index) => {
            return (
            <Row key={k} align="middle" type="flex" justify="space-around">
                <Col span={iW}>
                    <FormItem
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`sourceTableColumns[${k}]`, {
                            rules: [{ required: true, message: '请输入源表比较字段' }],
                        })(
                            <AutoComplete dataSource={columns1} placeholder="源表字段" />
                        )}
                    </FormItem>
                </Col>
                {
                    ShowSelect ? (<Col span={4}>
                        <FormItem
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        required={false}
                        key={k}
                        hasFeedback={!DisableSelect}
                        >
                        {getFieldDecorator(`funcs[${k}]`, {
                            initialValue: '=',
                            rules: [
                            { required: true, message: '请选择比较操作' },
                            ],
                        })(
                            <Select disabled={DisableSelect}>
                                <Option value="=">=</Option>
                                <Option value=">">&gt;</Option>
                                <Option value="<">&lt;</Option>
                                <Option value=">=">&gt;=</Option>
                                <Option value="<=">&lt;=</Option>
                                <Option value="<>">!=</Option>
                            </Select>
                        )}
                        </FormItem>
                    </Col>):null
                }
            
                <Col span={iW}>
                    <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    required={false}
                    key={k}
                    >
                        {getFieldDecorator(`targetTableColumns[${k}]`, {
                            rules: [{ required: true, message: '请输入目标表比较字段' }],
                        })(
                            <AutoComplete dataSource={columns2} placeholder="目标字段" />
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
            </Row>)
        })
        return (
        <Form onSubmit={this.handleSubmit} id='self-cal-add'>
            <FormItem label="结果集中文名" {...formItemLayout}>
            {getFieldDecorator('resultCollectionName', {
                rules: [{ required: true, message: '请输入结果集名字' }],
            })(
                <Input placeholder="步骤结果1" />
            )}
            </FormItem>
            {ColumnSelect ? (<Row align="middle" type="flex" justify="space-around">
                <Col span={RightColumnSelect ? 11 : 24}>
                <FormItem
                {...formItemLayout}
                >
                {getFieldDecorator('sourceTableShowColumns', {
                    rules: [
                    { required: true, message: '请选择源表要显示的属性', type: 'array' },
                    ],
                })(
                    <Select mode='multiple' placeholder="选择源表要显示的属性">
                        {opt1}
                    </Select>
                )}
                </FormItem>
                </Col>
                {RightColumnSelect ? (<Col span={11}>
                    <FormItem
                    {...formItemLayout}
                    >
                    {getFieldDecorator('targetTableShowColumns', {
                        rules: [
                        { required: true, message: '请选择目标表要显示的属性', type: 'array' },
                        ],
                    })(
                        <Select mode='multiple' placeholder="选择目标表要显示的属性">
                            {opt2}
                        </Select>
                    )}
                    </FormItem>
                </Col>) : null}
            </Row>):null}

            {formItems}
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
