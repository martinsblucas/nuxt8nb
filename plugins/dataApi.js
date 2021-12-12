export default function (context, inject) {
  if (!context.$config.ALGOLIA_APPLICATION_ID)
    console.error('[Data Api Plugin] Application ID is not configured')
  else if (!context.$config.ALGOLIA_API_KEY)
    console.error('[Data Api Plugin] Api Key is not configured')

  const headers = {
    'X-Algolia-API-Key': context.$config.ALGOLIA_API_KEY,
    'X-Algolia-Application-Id': context.$config.ALGOLIA_APPLICATION_ID,
  }

  inject('dataApi', {
    getHome,
    getReviewsByHomeId,
    getUserByHomeId,
    getHomesByLocation
  })

  async function getHome(homeId) {
    try {
      return unwrap(
        await fetch(
          `https://${context.$config.ALGOLIA_APPLICATION_ID}.algolia.net/1/indexes/homes/${homeId}`,
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
          `https://${context.$config.ALGOLIA_APPLICATION_ID}.algolia.net/1/indexes/reviews/query`,
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

  async function getHomesByLocation({ lat, lng, radiusInMeters = 1500 }) {
    try {
      return unwrap(
        await fetch(
          `https://${context.$config.ALGOLIA_APPLICATION_ID}.algolia.net/1/indexes/homes/query`,
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
          `https://${context.$config.ALGOLIA_APPLICATION_ID}.algolia.net/1/indexes/users/query`,
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

  async function unwrap(response) {
    const json = await response.json()
    const { ok, status, statusText } = response
    return {
      json,
      ok,
      status,
      statusText,
    }
  }

  function getErrorResponse(error) {
    return {
      json: {},
      ok: false,
      status: 500,
      statusText: error.message,
    }
  }
}
