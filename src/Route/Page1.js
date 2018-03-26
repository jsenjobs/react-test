import React, {Component} from 'react';
import {Row, Col, Card} from 'antd'
import 'antd/dist/antd.css'

import ParentTimer from '../Clock/ParentTimer'
import RClock from '../ReduxClock/RClock'
import LoginState from '../Login/LoginState'
import FormTest from '../UI/FormTest'
import ParametersTest from '../UI/PrametersTerst'
import RefTest from '../Refs/RefTest'


class Page1 extends Component {
    render() {
        return (<div>
                <h1>This is {this.props.match.params.name}</h1>
                <Row>
                    <Col span={11}><Card title="State Props clock" bordered={true}><ParentTimer /></Card></Col>
                    <Col span={2} />
                    <Col span={11}><Card title="Redux clock" bordered={true}><RClock /></Card></Col>
                </Row>
                <Row>
                    <Col span={11}><Card title="Form" bordered={true}><FormTest options={['Item1','Item2','Item3','Item4','Item5','Item6','Item7']} /></Card></Col>
                    <Col span={2} />
                    <Col span={11}><Card title="State Login" bordered={true}><LoginState /></Card></Col>
                </Row>
                <Row>
                    <Col span={11}><Card title="event parameters" bordered={true}><ParametersTest /></Card></Col>
                    <Col span={2} />
                    <Col span={11}><Card title="get value use refs" bordered={true}><RefTest /></Card></Col>
                </Row>
            </div>)
    }

    routerWillLeave(nextLocation) {
        alert('will go to ' + nextLocation)
    }
}

export default Page1