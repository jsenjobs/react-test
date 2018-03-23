import React, {Component} from 'react';
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
                <ParentTimer />
                <RClock />
                <LoginState />
                <FormTest options={['Item1','Item2','Item3','Item4','Item5','Item6','Item7']} />
                <ParametersTest />
                <RefTest />
            </div>)
    }

    routerWillLeave(nextLocation) {
        alert('will go to ' + nextLocation)
    }
}

export default Page1