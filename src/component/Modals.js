import React, {Component} from 'react'
import { Row, Col, Layout, Tree, Icon, Table, Button, Tag, Modal, Form, Input, message, Checkbox} from 'antd'
import { isExportSpecifier } from 'typescript';
import ModeAggregation from './part/part/ModeAggregation';

const ButtonGroup = Button.Group
const FormItem = Form.Item

// 1
class ModalRenameModel extends Component {
    render() {
        let {cancel, modalShow} = this.props
        let {getFieldDecorator} = this.props.form
        return <Modal
            title="文件重命名"
            footer={null}
            visible={modalShow}
            onCancel={cancel}
        >
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入文件名字' }],
                })(
                    <Input placeholder="文件名字" />
                )}
                </FormItem>
                <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    重命名
                </Button>
                </FormItem>
            </Form>
        </Modal>
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.ok(values.name)
            }
        });
    }
}

// 2
class ModalCreateShareModel extends Component {
    render() {
        let {cancel, modalShow} = this.props
        let {getFieldDecorator} = this.props.form
        return <Modal
            title="发布模型"
            footer={null}
            visible={modalShow}
            onCancel={cancel}
        >
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                {getFieldDecorator('intro', {
                    rules: [{ required: true, message: '请输入对模型的简单介绍' }],
                })(
                    <Input placeholder="模型介绍" />
                )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('_private', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox>发布为私有模型(私有模型仅自己可见)</Checkbox>
                    )}
                </FormItem>
                <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    发布
                </Button>
                </FormItem>
            </Form>
        </Modal>
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let type = 0
                if(values._private) {
                    type = 1
                }
                this.props.ok(values.intro, type)
            }
        });
    }
}

export default {
    ModalRenameModel: Form.create()(ModalRenameModel),
    ModalCreateShareModel: Form.create()(ModalCreateShareModel),
}
