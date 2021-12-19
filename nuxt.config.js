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
  buildModules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  modules: [
    '@nuxtjs/dotenv',
    '~/modules/auth',
    '~/modules/algolia',
    '~/modules/cloudinary',
    '@nuxtjs/cloudinary'
  ],
  css: ['~/assets/sass/app.scss'],
  build: {
    extractCSS: true,
    loaders: {
      limit: 0,
    },
  },

  cloudinary: {
    cloudName: process.env.CLODINARY_NAME,
    apiKey: process.env.CLODINARY_API_KEY
  },

  image: {
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLODINARY_NAME}/image/upload/`
    }
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

    cloudinary: {
      apiKey: process.env.CLODINARY_API_KEY
    }
  },

  privateRuntimeConfig: {
    algolia: {
      applicationId: process.env.ALGOLIA_APPLICATION_ID,
      apiKey: process.env.ALGOLIA_PRIVATE_API_KEY,
    },

    cloudinary: {
      apiSecret: process.env.CLODINARY_API_SECRET,
    },
  },
}
