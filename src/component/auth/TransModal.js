import React, {Component} from 'react'
import {Transfer, Modal} from 'antd'

class App extends Component {
    state = {
        selectedKeys: []
    }

    render() {
        const {title, visible, ok, cancel, onChange, data, titles, targetKeys} = this.props
        const {selectedKeys} = this.state
        return <Modal title={title}
            visible={visible}
            onOk={ok}
            onCancel={cancel}
        >
        <Transfer
            dataSource={data}
            titles={titles}
            targetKeys={targetKeys}
            onChange={onChange}
            render={item => item.title}

            selectedKeys={selectedKeys}
            onSelectChange={this.handleSelectChange}
        />
        </Modal>
    }
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    }
}

export default App
