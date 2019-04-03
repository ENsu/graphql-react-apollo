import React, { Component, Fragment } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { LINKS_PER_PAGE } from '../constants'


export const FEED_QUERY = gql`
 query($first: Int, $skip: Int) {
    links(first: $first, skip: $skip) {
     id
     url
     description
     postedBy {
        id
        username
      }
      votes {
        id
        user {
          id
        }
      }
    }
    count
  }
`

class LinkList extends Component {

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 10
    // You start by reading the current state of the cached data for the FEED_QUERY from the store.
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip }
    })

    // Now you’re retrieving the link that the user just voted for from that list. 
    // You’re also manipulating that link by resetting its votes to the votes that were just returned by the server.
    const votedLink = data.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes

    // Finally, you take the modified data and write it back into the store.
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    return { first, skip }
  }

  _getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new')
    if (isNewPage) {
      return data.links
    }
    const rankedLinks = data.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= data.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  render() {
    return (
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          const linksToRender = this._getLinksToRender(data)
          const isNewPage = this.props.location.pathname.includes('new')
          const pageIndex = this.props.match.params.page
            ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
            : 0
    
          return (
            <Fragment>
              {linksToRender.map((link, index) => (
                <Link key={link.id} link={link} index={index} 
                  updateStoreAfterVote={this._updateCacheAfterVote}/>
              ))}
              {isNewPage && (
                <div className="flex ml4 mv3 gray">
                  <div className="pointer mr2" onClick={this._previousPage}>
                    Previous
                  </div>
                  <div className="pointer" onClick={() => this._nextPage(data)}>
                    Next
                  </div>
                </div>
              )}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export default LinkList