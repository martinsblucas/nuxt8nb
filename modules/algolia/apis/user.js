import fetch from 'node-fetch'
import { unwrap, getErrorResponse } from '../../../utils/fetchUtils'
import { getHeaders } from '../helpers'

export default (algoliaConfig) => {
  const headers = getHeaders(algoliaConfig)
  return {
    assignHome: async function (identity, homeId) {
      const payload = (await this.getById(identity)).json
      payload.homeId.push(homeId)
      return this.create(identity, payload)
    },

    removeHome: async function (identity, homeId) {
      const payload = (await this.getById(identity)).json
      const homes = payload.homeId.filter(id => id != homeId)
      payload.homeId = homes
      return this.create(identity, payload)
    },

    create: async function (identity, payload) {
      try {
        return unwrap(
          await fetch(
            `https://${algoliaConfig.applicationId}.algolia.net/1/indexes/users/${identity.id}`,
            {
              headers,
              method: 'PUT',
              body: JSON.stringify(payload),
            }
          )
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    getById: async function (identity) {
      try {
        return unwrap(
          await fetch(
            `https://${algoliaConfig.applicationId}.algolia.net/1/indexes/users/${identity.id}`,
            { headers }
          )
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },
  }
}
