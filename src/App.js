// @flow
import 'antd/dist/antd.css'
import React, { Component } from 'react';


// we could use hashrouter or browserRouter
// hashs router : /#/page1 /#/page2 // if the web point is static resource more
// and browser router is  /page1 /page2 // if more dynamic request
// import { BrowserRouter as Router, HashRouter as Router, Route} from 'react-router-dom';
// switch will only render the first fit component and if no switch router will render all fit path's component
// Route component render// a component function in {} children //similary with render but it will be render any way{empty hold??}
import { BrowserRouter as Router} from 'react-router-dom';
import { Provider} from 'react-redux';
import {createStore, applyMiddleware } from 'redux'
// import {createLogger} from 'redux-logger'
import promiseMiddleware from 'redux-promise';
import reducer from './Redux/Reducer'
import { Route, Switch, Redirect} from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Login from './Login'
import StateSelect from './StateSelect'
// const logger = createLogger()
const store = createStore(reducer, {}, applyMiddleware(promiseMiddleware))

class App extends Component {
  render() {
    return (
      <CookiesProvider>
      <Provider store={store}>
        <Router>
            <Switch>
              <Route exact path='/' /*  route path /path0 will fit /path0 /path0/xxxx and more if want only fit /path0 use exact(={true}) props*/ >
                <Redirect to='/main' />
              </Route>
              <Route path='/login' component={Login} />
              <Route path='/main' component={StateSelect} />
            </Switch>
        </Router>
      </Provider>
      </CookiesProvider>
    );
  }
}

export default App;
