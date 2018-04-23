import React, {Component} from 'react'
import { Transfer, Modal } from 'antd';



class App extends React.Component {
  state = {
        selectedKeys: [],
  }
  props = {
    data:[],
    targetKeys:[],

  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  }

  handleScroll = (direction, e) => {
    // console.log('direction:', direction);
    // console.log('target:', e.target);
  }

  render() {
    const state = this.state;
    return (
        <Modal
                style={{top:0}}
                title="关联表"
                visible={this.props.visible}
                onCancel={this.props.onCancel}
                onOk={this.props.onOk}
            >
            <Transfer
                dataSource={this.props.dataSource}
                listStyle={{
                width: 'calc(50% - 23px)',
                height: 400,
                }}
                operationStyle={{
                width: 'calc(50% - 23px)',
                height: 400,
                }}
                showSearch
                titles={['未关联的表', '已关联的表']}
                notFoundContent='没有表'
                targetKeys={this.props.targetKeys}
                selectedKeys={state.selectedKeys}
                onChange={this.props.handleChange}
                onSelectChange={this.handleSelectChange}
                onScroll={this.handleScroll}
                render={item => item.title}
            />
      </Modal>
    );
  }
}
export default App