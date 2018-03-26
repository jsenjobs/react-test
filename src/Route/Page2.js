import React, {Component} from 'react';
import {Row, Col, Card} from 'antd'
import 'antd/dist/antd.css'
import {Prompt} from 'react-router-dom'
import ReduxCount from '../ReduxCount/ReduxCount'
import ReduxClock from '../ReduxClock/RClock'
import ReduxHttp from '../ReduxHttp/ReduxHttp'
import { withRouter} from 'react-router-dom';

class Page2 extends Component {
    render() {
        return (<div>
          <h4>Use react-redux to update ui</h4>
          <Prompt message='确定离开吗' />
            <Row>
                <Col span={11}><Card title="redux cal" bordered={true}><ReduxCount /></Card></Col>
                <Col span={2} />
                <Col span={11}><Card title="redux clock" bordered={true}><ReduxClock /></Card></Col>
            </Row>
            <Row>
                <Col span={11}><Card title="redux http" bordered={true}><ReduxHttp /></Card></Col>
            </Row>
      </div>)
    }
}

export default withRouter(Page2)
