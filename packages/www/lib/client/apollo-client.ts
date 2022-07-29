import { concat, ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client'
import { getUserToken } from './auth'

const herokuUri = process.env.NEXT_PUBLIC_HEROKU_URI

if (typeof herokuUri === 'undefined' || herokuUri === '') {
  console.error('The NEXT_PUBLIC_HEROKU_URI environment variable is not set, exiting.')
  process.exit(1)
}

const isServer = () => typeof window === 'undefined'

const httpLink = createHttpLink({ uri: herokuUri, credentials: 'include' })

// This adds the authorization to the header of every request
const authMiddleware = new ApolloLink((operation, forward) => {
  console.log('Creating new Apollo Client, calling authMiddleware')
  let token: String | undefined

  if (!isServer()) token = getUserToken()

  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) },
  }))

  return forward(operation)
})

const client = new ApolloClient({
  uri: herokuUri,
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
})

export default client
