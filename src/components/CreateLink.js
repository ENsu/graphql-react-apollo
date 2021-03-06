import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'
import gql from 'graphql-tag'

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    createLink(
      url: $url,
      description: $description
    ) {
      id
      url
      description
    }
  }
`

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation 
          mutation={POST_MUTATION} 
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE
            const skip = 0

            // read old cache
            const data = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip }
            })

            // insert new post at the beginning of the list
            data.links.unshift(post)

            // write the result back to the store
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip }
            })
          }}>
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreateLink