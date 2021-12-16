import { sendJSON } from '../helpers'

export default (apis) => {
  return async function getUserRoute(req, res, next) {
    const payload = makeUserPayload(req.identity)
    await apis.user.findOrCreate(req.identity, payload)
    sendJSON(payload, res)
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
}
