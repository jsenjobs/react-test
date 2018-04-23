import React, {Component} from 'react'
import { Button, Modal } from 'antd';
import 'antd/dist/antd.css'
import {connect} from 'react-redux'
import {fetchGets as fg} from '../Api'
class ReduxHttp extends Component {

  constructor(props) {
    super(props)
    this.state = {page:1}
  }

  render() {
    const {httpResult} = this.props
    let data = ""
    if(httpResult.code === 0) {
      data = '正在获取数据'
    } else if(httpResult.code === 1) {
      data = JSON.stringify(httpResult.response)
    } else if(httpResult.code === -1) {
      data = '获取数据失败：' + JSON.stringify(httpResult.error)
    } else {
      data = '点击获取数据'
    }
    return (<div>
      <input type='text' value={this.state.page} onChange={this.changePage} />
      <Button onClick={this.info.bind(this, this.state.page)} type='primary'>GetHttp</Button>
      <div>{data}</div>
      </div>)
  }
  changePage = (e) => {
    this.setState({page:e.target.value})
  }

  info(page) {
    const {onGetHttp} = this.props
    Modal.info({
      title: '参数提示',
      content: (
        <div>
          {page}
        </div>
      ),
      onOk() {
        onGetHttp(page)
      },
    });
  }
}

function mapStateToProps(state) {
  return {
    httpResult: state.httpResult
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onGetHttp: (page) => dispatch(fg(dispatch, page))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxHttp)
