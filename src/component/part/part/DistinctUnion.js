import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Radio, Select, Cascader, AutoComplete} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const {Option} = Select
class ModeAggregation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected:'eq',
            table1SelectedComumns:[],
            table2SelectedComumns:[],
            table1Column:[],
            table2Column:[],
            column1SelectModal: false,
            column2SelectModal: false,
        }

    }
    getSelectedString = (arr, def) => {
        if(arr.length === 0) return def
        let s = ''
        arr.forEach(a => {
            s += a + ','
        })
        s = s.substring(0, s.length - 1)
        return s
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {submitConf} = this.props
                values.selected = this.state.selected
                submitConf(values)
            }
        });
    }
    componentDidMount() {
    }
    render() {
        const {ColumnSelect, RightColumnSelect, DisableSelect, ShowSelect} = this.props
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        let iW = ShowSelect ? 10 : 12
        let sW = 24 - iW * 2
        return (
        <Form onSubmit={this.handleSubmit} id='self-cal-add'>
            <FormItem {...formItemLayout}>
            
            <Row>
                <Col span={12} style={{background:'#dddddd',textAlign:'center'}}>表1</Col>
                <Col span={12} style={{background:'#ddd',textAlign:'center'}}>表2</Col>
            </Row>
            {ColumnSelect ? (<Row>
                <Col span={12}><Button onClick={_ => this.setState({column1SelectModal:true})} style={{width:'100%'}}>{this.getSelectedString(this.state.table1SelectedComumns, '选择属性')}</Button></Col>
                {RightColumnSelect ? (<Col span={12}><Button onClick={_ => this.setState({column2SelectModal:true})} style={{width:'100%'}}>{this.getSelectedString(this.state.table2SelectedComumns, '选择属性')}</Button></Col>) : null}
            </Row>):null}

            
            </FormItem>
            <Row>
                <Col span={iW}>
                    <FormItem>
                        {getFieldDecorator('table1Column', {
                            rules: [{ required: true, message: '请输入表一比较字段' }],
                        })(
                            <Input placeholder="字段1" />
                        )}
                    </FormItem>
                </Col>
                {
                    ShowSelect ? (<Col span={sW}>
                        <FormItem
                        hasFeedback>
                            <Select disabled={DisableSelect} defaultValue={this.state.selected} value='eq' style={{ width: '100%' }}>
                                <Option value="eq">=</Option>
                                <Option value="gt">&gt;</Option>
                                <Option value="lt" disabled>&lt;</Option>
                                <Option value="gteq">&gt;=</Option>
                                <Option value="lteq">&lt;=</Option>
                                <Option value="noteq">!=</Option>
                            </Select>
                        </FormItem>
                    </Col>):null
                }
                
                <Col span={iW}>
                    <FormItem>
                        {getFieldDecorator('table2Column', {
                            rules: [{ required: true, message: '请输入表二比较字段' }],
                        })(
                            <Input placeholder="字段2" />
                        )}
                    </FormItem>
                </Col>
                
            </Row>
            <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
                确定
            </Button>
            </FormItem>

            <Modal
                title="选择属性"
                visible={this.state.column1SelectModal || this.state.column2SelectModal}
                onOk={this.columnSelectOk}
                onCancel={this.columnSelectCancel}
                >
                {this.state.column1SelectModal ? this.props.table1Column.map(item => {
                    return <p>{item}</p>
                }): this.props.table2Column.map(item => {
                    return <p>{item}</p>
                })}
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </Form>
        );
    }

    columnSelectCancel = () => {
        this.setState({column1SelectModal:false, column2SelectModal:false})
    }

    columnSelectOk = () => {
        this.setState({column1SelectModal:false, column2SelectModal:false})
    }
}
ModeAggregation.defaultProps = {
    table1Column:['id', 'name', 'sex'],
    table2Column:['id', 'age', 'address'],
}
function mapStateToProps(state) {
    return {
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        submitConf: (conf) => dispatch({type:'ON_GET_MODEL_WORK_CONF', data:{type:'DistinctUnion', data:conf}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ModeAggregation)) 
