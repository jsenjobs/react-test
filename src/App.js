// @flow
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NameModule from './NameModule';
import Props from './Props';
import Time from './Time';
import Toggle from './Toggles';
import Login from './LoginState';
import TestList from './TestLists';
import TestForm from './TestForms';
import RouteTest from './RouteTest';
import Page1 from './page/Page1';
import Page2 from './page/Page2';

import { BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
      <BrowserRouter>
      <div>
        <RouteTest />
        <Route path='/page1' component={Page1} />
        <Route path='/page2' component={Page2} />
        </div>
      </BrowserRouter>
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <TestForm />
        <NameModule />
        <Props name='jack' />
        <Props name='jac2k' />
        <Props name='jack3' />
        <Time />
        <Toggle />
        <Login />
        <TestList datas={[1,2,3,4,5,9]}/>
      </div>
    );
  }
}

export default App;
