import React, {Component} from 'react';


class ChildTimer extends Component {
    render() {
        return (<div>
            <h1>This child timer</h1>
            <h2>Current child timer is{this.props.date.toLocaleTimeString()}</h2>
        </div>)
    }


}

export default ChildTimer