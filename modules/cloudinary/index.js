import { utils as cloudinaryUtils } from 'cloudinary'

export default function () {
  const config = this.options.privateRuntimeConfig.cloudinary

  this.nuxt.hook('render:setupMiddleware', (app) => {
    app.use('/api/cloudinary/signature', setSignature)
  })

  async function setSignature(req, res) {
    try {
      const signature = await cloudinaryUtils.api_sign_request(req.body, config.apiSecret)

      res.end(
        JSON.stringify({
          signature,
        })
      )
    } catch (error) {
      console.error(error)
    }
  }
}
