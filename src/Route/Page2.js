import React, {Component} from 'react';
import {Prompt} from 'react-router-dom'
import ReduxCount from '../ReduxCount/ReduxCount'
import ReduxClock from '../ReduxClock/RClock'
import ReduxHttp from '../ReduxHttp/ReduxHttp'

class Page2 extends Component {
    render() {
        return (<div>
          <h4>Use react-redux to update ui</h4>
          <Prompt message='确定要离开吗' />
          <ReduxCount />
          <ReduxClock />
          <ReduxHttp />
      </div>)
    }
}

export default Page2
