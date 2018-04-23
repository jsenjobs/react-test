import React, {Component} from 'react'
import {Modal, Row, Col, Form, Input, Icon, Checkbox, Button, Table, Cascader, AutoComplete} from 'antd'
import {connect} from 'react-redux'
import './Trans.css'
const FormItem = Form.Item

const EditableCell = ({ editable, value, onChange, edit, save }) => (
    editable ? 
        <div><Input className={['no-style-input']} onBlur={save} autoFocus value={value} onChange={e => onChange(e.target.value)} /></div>
        :(<div onClick={edit}>{value}</div>)
  );
  
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            holdData: [],
            data: [],
            searchFilter: '',
            
        }

        this.columns = [{
            title: '字段中文名字',
            dataIndex: 'name',
          }, {
            title: '字段英文名字',
            dataIndex: 'column',
          }, {
            title: '新字段英文名字',
            dataIndex: 'n_column',
            render:  (text, record) => this.renderColumns(text, record, 'n_column')
          }]

    }
    componentDidMount() {
        if(this.props.dbColumns) {
            let data = this.props.dbColumns.map(d => {
                return {
                    key: d.field,
                    name: d.field,
                    column: d.field,
                    n_column: d.field,
                }
            })

            this.setState({data: data, holdData: [...data]})
        }
    }
    componentWillReceiveProps(newProps) {
        if(this.props.visible && !newProps.visible) {
            this.setState({data:[], holdData: []})
            this.props.form.resetFields()
        }
        if(newProps.dbColumns) {
            let data = newProps.dbColumns.map(d => {
                return {
                    key: d.field,
                    name: d.field,
                    column: d.field,
                    n_column: d.field,
                }
            })
            this.setState({data: data, holdData: [...data]})
        }
    }
    renderColumns(text, record, column) {
        return (
          <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}
            edit={_ => this.edit(record.key)}
            save={_ => this.save(record.key)}
          />
        );
      }
      edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = true;
          this.setState({ data: newData });
        }
      }
      save(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable;
          this.setState({ data: newData });
          this.cacheData = newData.map(item => ({ ...item }));
        }
      }
      handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.setState({ data: newData });
        }
      }

    handleSubmit = (e) => {
        e.preventDefault();
        let {submitConf} = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.changeColumns = this.state.data
                submitConf(values)
            }
        });
    }
    filterChange = (searchFilter) => {
        const reg = new RegExp(searchFilter, 'gi')
        let data = this.state.holdData.filter(item => item.column.match(reg))
        this.setState({data, searchFilter})
    }
    render() {
        const { dbColumns } = this.props
        let c
        if(dbColumns) {
            c = dbColumns.map(item => item.field)
        } else {
            c = []
        }
        
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 14 },
        }
        const formItemLayoutWithOutLabel = {}
        return (
        <Form id='self-cal-change' onSubmit={this.handleSubmit}>
            <FormItem label="结果集中文名" {...formItemLayout}>
                {getFieldDecorator('resultCollectionName', {
                    rules: [{ required: true, message: '请输入结果集名字' }],
                })(
                    <Input placeholder="步骤结果1" />
                )}
            </FormItem>
            <FormItem style={{marginBottom:4}}>
                <Table title={_ => (<AutoComplete onChange={this.filterChange} value={this.state.searchFilter} dataSource={c} placeholder='搜索字段' 
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1} />)} 
                columns={this.columns} dataSource={this.state.data} size="small" 
                bordered pagination={false}/>
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

function mapStateToProps(state) {
    return {
    }
  }
function mapDispatchToProps(dispatch) {
    return {
        submitConf: (conf) => dispatch({type:'ON_GET_MODEL_WORK_CONF', data:{type:'ChangeColumn', data:conf}})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(App))  
