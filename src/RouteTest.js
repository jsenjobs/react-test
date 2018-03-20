import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class RouteTest extends Component {
    render() {
        return (<div>
            <h1>route example</h1>
                <ul>
                    <li><Link to='/page1'>Page1</Link></li>
                    <li><Link to='/page2'>Page2</Link></li>
                </ul>
            {this.props.children}
        </div>)
    }
}

export default RouteTest