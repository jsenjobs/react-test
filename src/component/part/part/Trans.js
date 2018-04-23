import React, {Component} from 'react'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Table, Cascader} from 'antd'
import {connect} from 'react-redux'
import './Trans.css'
const FormItem = Form.Item


  
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        let {submitConf} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                submitConf(values)
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        const formItemLayoutWithOutLabel = {}
        return (
        <Form id='self-cal-trans' onSubmit={this.handleSubmit}>
            <FormItem label="结果集中文名" {...formItemLayout}>
                {getFieldDecorator('resultCollectionName', {
                    rules: [{ required: true, message: '请输入结果集名字' }],
                })(
                    <Input placeholder="步骤结果1" />
                )}
            </FormItem>
            <FormItem style={{marginBottom:4}}>
                <Table columns={this.props.columns} dataSource={this.props.data} size="small" bordered pagination={false}/>
            </FormItem>
            <FormItem style={{marginBottom:4}}>
                <Button type="dashed" className="login-form-button">
                    预览数据
                </Button>
            </FormItem>
            <FormItem>
                <Table columns={this.props.p_columns} dataSource={this.props.p_data} title={() => '预览数据'} size="small" bordered pagination={false}/>
            </FormItem>
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
    p_columns:[],
    p_data:[],
    columns:[{
        title: 'Name',
        dataIndex: 'name',
      }, {
        title: 'Age',
        dataIndex: 'age',
      }, {
        title: 'Address',
        dataIndex: 'address',
      }],
    data:[{
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      }]
}
function mapStateToProps(state) {
    return {
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        submitConf: (conf) => dispatch({type:'ON_GET_MODEL_WORK_CONF', data:{type:'Trans', data:conf}})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(App)) 
