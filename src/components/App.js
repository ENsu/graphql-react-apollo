import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import { ApolloConsumer } from "react-apollo"
import logo from '../logo.svg';
import '../styles/App.css';

import Header from './Header'
import Login from './Login'
import Search from './Search'
import LinkList from './LinkList'
import CreateLink from './CreateLink'

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
            <Route exact path='/search' component={Search} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
