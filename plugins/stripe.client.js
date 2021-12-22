import { unwrap, getErrorResponse } from '~/utils/fetchUtils'

export default function ({ router }, inject) {
  inject('stripe', {
    checkout,
  })

  async function createSession(homeId, start, end) {
    try {
      return unwrap(
        await fetch(`/api/stripe/create-session`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            homeId,
            start,
            end,
          }),
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function checkout(homeId, start, end) {
    const response = await createSession(homeId, start, end)
    window.location = response.json.url
  }
}
