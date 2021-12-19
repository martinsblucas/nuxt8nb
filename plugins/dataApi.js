import { unwrap, getErrorResponse } from '~/utils/fetchUtils'

export default function ({ $config }, inject) {
  if (!$config.algolia.applicationId)
    console.error('[Data Api Plugin] Application ID is not configured')
  else if (!$config.algolia.apiKey)
    console.error('[Data Api Plugin] Api Key is not configured')

  const headers = {
    'X-Algolia-API-Key': $config.algolia.apiKey,
    'X-Algolia-Application-Id': $config.algolia.applicationId,
  }

  inject('dataApi', {
    getHome,
    getReviewsByHomeId,
    getUserByHomeId,
    getHomesByLocation,
    getHomes,
  })

  async function getHome(homeId) {
    try {
      return unwrap(
        await fetch(
          `https://${$config.algolia.applicationId}.algolia.net/1/indexes/homes/${homeId}`,
          { headers }
        )
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getReviewsByHomeId(homeId) {
    try {
      return unwrap(
        await fetch(
          `https://${$config.algolia.applicationId}.algolia.net/1/indexes/reviews/query`,
          {
            headers,
            method: 'POST',
            body: JSON.stringify({
              params: `facetFilters=homeId:${homeId}`,
              hitsPerPage: 6,
            }),
          }
        )
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomesByLocation({ lat, lng, radiusInMeters = 1500 * 15 }) {
    try {
      return unwrap(
        await fetch(
          `https://${$config.algolia.applicationId}.algolia.net/1/indexes/homes/query`,
          {
            headers,
            method: 'POST',
            body: JSON.stringify({
              aroundLatLng: `${lat},${lng}`,
              aroundRadius: radiusInMeters,
              hitsPerPage: 10,
            }),
          }
        )
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getUserByHomeId(homeId) {
    try {
      return unwrap(
        await fetch(
          `https://${$config.algolia.applicationId}.algolia.net/1/indexes/users/query`,
          {
            headers,
            method: 'POST',
            body: JSON.stringify({
              params: `facetFilters=homeId:${homeId}`,
            }),
          }
        )
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomes() {
    try {
      return unwrap(
        await fetch(
          `https://${$config.algolia.applicationId}.algolia.net/1/indexes/homes/query`,
          {
            headers,
            method: 'POST',
            body: JSON.stringify({
              hitsPerPage: 3,
            }),
          }
        )
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }
}
