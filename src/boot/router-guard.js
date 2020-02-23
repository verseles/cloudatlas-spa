import { Notify } from 'quasar'

export default ({ app, router }) => {
  // Inform Google Analytics - injected only in netlify
  router.beforeEach((to, from, next) => {
    if (typeof ga !== 'undefined') {
      ga('set', 'page', to.path)
      ga('send', 'pageview')
    }
    next()
  })

  router.beforeEach((to, from, next) => {
    app.$store.body = {}
    app.$store.errors = {}
    if (to.meta.unguarded) {
      // Allowed without auth
      next()
    } else {
      let token = null,
        tawk_hash = null,
        user = {}
      if (typeof app.$store.token === 'string') {
        token = app.$store.token
      } else if (app.$storage.has('token')) {
        token = app.$storage.getItem('token')
        user = app.$storage.getItem('user')
        tawk_hash = app.$storage.getItem('tawk_hash')

        app.$store.token = token
        app.$store.user = user
        app.$store.tawk_hash = tawk_hash

        app.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

        // @TODO enable token refresh
      }

      if (!token) {
        if (!to.meta.unguarded) {
          app.$storage.set('afterLogin', to.path) // Save to get back to the link tried
        }

        Notify.create({
          message: 'Please, login to start',
          icon: 'mdi-security',
          timeout: 2000,
          type: 'info'
        })

        next({ path: '/login' })
      } else {
        next()
      }
    }
  })
};
