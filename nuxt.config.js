export default {
  components: true,
  head: {
    titleTemplate: 'Mastering Nuxt: %s',
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'description',
        name: 'description',
        content: 'My website description',
      },
    ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  router: {
    prefetchLinks: false,
  },

  plugins: [
    '~/plugins/maps.client',
    '~/plugins/dataApi',
    '~/plugins/auth.client',
  ],
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: ['@nuxtjs/dotenv', '~/modules/auth', '~/modules/algolia'],
  css: ['~/assets/sass/app.scss'],
  build: {
    extractCSS: true,
    loaders: {
      limit: 0,
    },
  },

  publicRuntimeConfig: {
    maps: {
      apiKey: process.env.MAPS_API_KEY,
    },

    algolia: {
      applicationId: process.env.ALGOLIA_APPLICATION_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
    },

    auth: {
      cookieName: 'idToken',
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
  },
  privateRuntimeConfig: {
    algolia: {
      applicationId: process.env.ALGOLIA_APPLICATION_ID,
      apiKey: process.env.ALGOLIA_PRIVATE_API_KEY,
    },
  },
}
