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
  plugins: ['~/plugins/maps.client', '~/plugins/dataApi'],
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: ['@nuxtjs/dotenv'],
  css: ['~/assets/sass/app.scss'],
  build: {
    extractCSS: true,
    loaders: {
      limit: 0,
    },
  },
  publicRuntimeConfig: {
    MAPS_API_KEY: process.env.MAPS_API_KEY,
    ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  },
  privateRuntimeConfig: {},
}
