// @flow
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import RouteTest from './Route/RouteTest';
import Page1 from './Route/Page1';
import Page2 from './Route/Page2';

// we could use hashrouter or browserRouter
// hashs router : /#/page1 /#/page2 // if the web point is static resource more
// and browser router is  /page1 /page2 // if more dynamic request
// import { BrowserRouter as Router, HashRouter as Router, Route} from 'react-router-dom';
// switch will only render the first fit component and if no switch router will render all fit path's component
// Route component render// a component function in {} children //similary with render but it will be render any way{empty hold??}
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { Provider} from 'react-redux';
import {createStore } from 'redux'
import reducer from './Redux/Reducer'


const store = createStore(reducer, {value:0})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
      <Router>
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <RouteTest />
          <Switch>
            <Route exact path='/' /*  route path /path0 will fit /path0 /path0/xxxx and more if want only fit /path0 use exact(={true}) props*/ >
              <Redirect to='/page1/page1' />
            </Route>
            <Route path='/page1/:name' component={Page1} />
            <Route path='/page2/:name' component={Page2} />
          </Switch>
        </div>
      </Router>
      </div>
      </Provider>
    );
  }
}

export default App;
