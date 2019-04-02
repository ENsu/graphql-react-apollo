import React, { Component } from 'react';
import Header from './Header'
import Login from './Login'
import { Switch, Route } from 'react-router-dom'
import CreateLink from './CreateLink'
import { ApolloConsumer } from "react-apollo"
import logo from '../logo.svg';
import '../styles/App.css';

import LinkList from './LinkList'

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={() => 
                <ApolloConsumer>
                  {client => <Login client={client} />}
                </ApolloConsumer>} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
