import fetch from 'node-fetch'
import { unwrap, getErrorResponse } from '../utils/fetchUtils'

export default function () {
  const algoliaConfig = this.options.privateRuntimeConfig.algolia

  const headers = {
    'X-Algolia-API-Key': algoliaConfig.apiKey,
    'X-Algolia-Application-Id': algoliaConfig.applicationId,
  }

  this.nuxt.hook('render:setupMiddleware', (app) => {
    app.use('/api/user', getUserRoute)
  })

  async function getUserRoute(req, res, next) {
    await createUser(req.identity)
    sendJSON(makeUserPayload(req.identity), res)
  }

  async function createUser(identity) {
    try {
      return unwrap(
        await fetch(
          `https://${algoliaConfig.applicationId}.algolia.net/1/indexes/users/${identity.id}`,
          {
            headers,
            method: 'PUT',
            body: JSON.stringify(makeUserPayload(identity)),
          }
        )
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  function makeUserPayload(identity) {
    return {
      name: identity.name,
      email: identity.email,
      image: identity.image,
      homeId: [],
      reviewCount: 0,
      description: '',
      joined: new Date().toISOString(),
    }
  }

  function sendJSON(data, res) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
}
