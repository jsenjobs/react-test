import React, {Component} from 'react';


class ChildTimer extends Component {
    render() {
        return (<div>
            <h2>Child Timer Current child timer is{this.props.date.toLocaleTimeString()}</h2>
        </div>)
    }


}

export default ChildTimer