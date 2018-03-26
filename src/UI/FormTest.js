import React, {Component} from 'react'
import { Form, Icon, Input, Button, Select } from 'antd';
import 'antd/dist/antd.css'
const FormItem = Form.Item;
const Option = Select.Option;


class PriceInput extends React.Component {
    constructor(props) {
      super(props);
  
      const value = this.props.value || {};
      this.state = {
        number: value.number || 0,
        currency: value.currency || 'rmb',
      };
    }
    componentWillReceiveProps(nextProps) {
      // Should be a controlled component.
      if ('value' in nextProps) {
        const value = nextProps.value;
        this.setState(value);
      }
    }
    handleNumberChange = (e) => {
      const number = parseInt(e.target.value || 0, 10);
      if (isNaN(number)) {
        return;
      }
      if (!('value' in this.props)) {
        this.setState({ number });
      }
      this.triggerChange({ number });
    }
    handleCurrencyChange = (currency) => {
      if (!('value' in this.props)) {
        this.setState({ currency });
      }
      this.triggerChange({ currency });
    }
    triggerChange = (changedValue) => {
      // Should provide an event to pass value to Form.
      const onChange = this.props.onChange;
      if (onChange) {
        onChange(Object.assign({}, this.state, changedValue));
      }
    }
    render() {
      const { size } = this.props;
      const state = this.state;
      return (
        <span>
          <Input
            type="text"
            size={size}
            value={state.number}
            onChange={this.handleNumberChange}
            style={{ width: '65%', marginRight: '3%' }}
          />
          <Select
            value={state.currency}
            size={size}
            style={{ width: '32%' }}
            onChange={this.handleCurrencyChange}
          >
            <Option value="rmb">RMB</Option>
            <Option value="dollar">Dollar</Option>
          </Select>
        </span>
      );
    }
  }

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class FormTest extends Component {
    /*
    constructor(props) {
        super(props)


        this.state = {
            selected:props.options[0]
        }
    }
    */

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
      }

      checkPrice = (rule, value, callback) => {
        if (value.number > 0) {
          callback();
          return;
        }
        callback('Price must greater than zero!');
      }
      
    render() {
        // const options = this.props.options
        // const optionsJSX = options.map((opt, index) => (<option key={index} value={opt}>{opt}</option>))

        
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        return (<Form layout="inline" onSubmit={this.submitForm}>
            <FormItem
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
            >
            {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
            </FormItem>
            <FormItem
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
            >
            {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
            })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
            </FormItem>
            <FormItem label="Price">
            {getFieldDecorator('price', {
                initialValue: { number: 1, currency: 'rmb' },
                rules: [{ validator: this.checkPrice }],
            })(<PriceInput />)}
            </FormItem>
            {/*
            <select value={this.state.setecled} onChange={this.onSelectChange}>
                {optionsJSX}
            </select>
            */}
            <FormItem>
            <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
            >
                Log in
            </Button>
            </FormItem>
        </Form>)
    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            alert(JSON.stringify(values))
        }
        });
    }

    /*
    onSelectChange = (e) => {
        this.setState({
            selected:e.target.value
        })
    }
    */
} 

export default Form.create()(FormTest)