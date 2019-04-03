import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import { withRouter } from "react-router-dom";

import gql from 'graphql-tag'


const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    createUser(email: $email, password: $password, username: $name) {
      user {
        id
        username
        email
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($name: String!, $password: String!) {
    tokenAuth(username: $name, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { login, email, password, name } = this.state
    return (
      <div>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
              type="text"
              placeholder="Your email address"
            />
          )}
          <input
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Your name"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? 'login' : 'create account'}
              </div>
            )}
          </Mutation>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login
              ? 'need to create an account?'
              : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

_confirm = async data => {
  let token = null
  if (this.state.login) {
    token = data.tokenAuth.token
    this._saveUserData(token)
    this.props.history.push("/")
  } else {
    const { password, name } = this.state
    this.props.client.mutate({
      mutation: gql`
        mutation {
          tokenAuth(username: "${name}", password: "${password}") {
              token
          }
        }`
    }).then(response => {
      console.log(`get response data: ${JSON.stringify(response.data)}`)
      token = response.data.tokenAuth.token
      console.log(`get token value: ${token}`)
      this._saveUserData(token) // this code need to be kept inside the 'then' function, or they won't be processed sequencially.
      this.props.history.push("/")
    })
  }
}

_saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

export default withRouter(Login)