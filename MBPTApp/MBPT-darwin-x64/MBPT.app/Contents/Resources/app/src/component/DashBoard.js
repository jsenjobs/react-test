import React, {Component} from 'react'
import './DashBoard.css'
import {Card, Row, Col, Popover} from 'antd'
import {Link} from 'react-router-dom';
import {genDashFunctions} from '../conf/NavConf'
const content = (
    <div>
      <p><a href='http://192.168.0.24:8080/static/chrome/ChromeStandaloneSetupWinXP32.exe'>Chrome-xp-32位</a></p>
      <p><a href='http://192.168.0.24:8080/static/chrome/ChromeStandaloneSetup.exe'>Chrome-32位</a></p>
      <p><a href='http://192.168.0.24:8080/static/chrome/ChromeStandaloneSetup64.exe'>Chrome-64位</a></p>
    </div>
  )


class DashBoard extends Component {
    render() {
        return (<div className={['code-box-demo']}>
            <Row>
                {genDashFunctions()}
                <Col span="8">
                <Popover content={content} title="选择平台"><Card>浏览器下载</Card></Popover>
                </Col>
            </Row>
          </div>)
    }
}

export default DashBoard