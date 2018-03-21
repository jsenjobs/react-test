import React, {Component} from 'react';
// eslint-disable-next-line
import RouteStyle from './RouteStyle.css'
import {Link} from 'react-router-dom';


class RouteTest extends Component {


    render() {
        return (<div>
                <ul>
                    <li><Link to='/page1/page1'>测试1</Link></li>
                    <li><Link to='/page2/page2'>测试2</Link></li>
                </ul>
            {this.props.children}
        </div>)
    }
}

export default RouteTest