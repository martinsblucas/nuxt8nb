import fetch from 'node-fetch'
import { unwrap, getErrorResponse } from '../../../utils/fetchUtils'
import { getHeaders } from '../helpers'

export default (algoliaConfig) => {
  const headers = getHeaders(algoliaConfig)
  return {
    findOrCreate: async (identity, payload) => {
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
  }
}
