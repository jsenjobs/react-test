import React, {Component} from 'react'
import 'whatwg-fetch'
import {connect} from 'react-redux'
import {getsJson as fg} from '../Api'
class EChartsWithHttp extends Component {

  constructor(props) {
    super(props)
    this.state = {page:1}
  }

  render() {
    const {httpResult, onGetHttp} = this.props
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
      <button onClick={onGetHttp.bind(this, 'http://echarts.baidu.com/examples/data/asset/data/weibo.json')}>GetHttp</button>
      <div>{data}</div>
      </div>)
  }
  changePage = (e) => {
    this.setState({page:e.target.value})
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

export default connect(mapStateToProps, mapDispatchToProps)(EChartsWithHttp)
