import Cookie from 'js-cookie'
import { unwrap } from '~/utils/fetchUtils'

export default ({ $config, store }, inject) => {
  addScript()
  addOnloadListener()

  inject('auth', {
    signOut,
  })

  function addScript() {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    document.head.appendChild(script)
  }

  function addOnloadListener() {
    window.onload = function () {
      window.google.accounts.id.initialize({
        client_id: $config.auth.clientId,
        callback: parseUser,
      })

      const googleButton = document.getElementById('googleButton')
      window.google.accounts.id.renderButton(googleButton, {})
    }
  }

  async function parseUser(response) {
    if (!response) {
      Cookie.remove($config.auth.cookieName)
      store.commit('auth/user', null)
      return
    }

    Cookie.set($config.auth.cookieName, response.credential, {
      expires: 1 / 24,
      sameSite: 'Lax',
    })

    try {
      const response = await unwrap(await fetch('/api/user'))
      const user = response.json

      store.commit('auth/user', {
        fullName: user.json,
        profileUrl: user.image,
      })
    } catch (error) {
      console.error(error)
    }
  }

  function signOut() {
    window.google.accounts.id.disableAutoSelect()
    Cookie.remove($config.auth.cookieName)
    store.commit('auth/user', null)
  }
}
