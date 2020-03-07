const mixinLogin = {
  methods: {
    refreshToken () {
      this.$axios.get('/token')
        .then(r => {
          // @TODO make this work
          // console.info(r);
        })
        .catch(e => {
          // @FIXME log this
          // console.warn(e);
        })
    },
    checkLogin () {
      if (this.getToken()) {
        return true
      } else {
        return false
      }
    },
    afterLogin () {
      if (this.$storage.has('afterLogin')) {
        this.$router.push(this.$storage.getItem('afterLogin'))
        this.$storage.remove('afterLogin')
      } else {
        this.$router.push(this.$store.afterLogin)
      }
    },
    getToken () {
      if (
        this.$store &&
        typeof this.$store.token === 'string' &&
        typeof this.$store.user === 'object' &&
        typeof this.$store.tawk_hash === 'string'
      ) {
        console.info('aprovado rápido')
        return this.$store.token
      } else if (this.$storage.has('token')) {
        console.info('aprovado memória')
        let token = this.$storage.getItem('token')
        let user = this.$storage.getItem('user')
        let tawk_hash = this.$storage.getItem('tawk_hash')

        this.setToken({ body: { token, user, tawk_hash } })

        return token
      } else {
        console.info('não aprovado')
        return null
      }
    },
    setToken ({ body }) {
      console.info('setToken', body)
      if (typeof body.token === 'string') {
        this.$storage.set('token', body.token)
        this.$storage.set('user', body.user)
        this.$storage.set('tawk_hash', body.tawk_hash)
        this.$store.token = body.token
        this.$axios.defaults.headers.common['Authorization'] =
          'Bearer ' + body.token

        // @TODO enable token refresh
      }
      if (typeof body.user === 'object') {
        this.$storage.set('user', body.user)
        this.$store.user = body.user
      }
      if (typeof body.tawk_hash === 'string') {
        this.$storage.set('tawk_hash', body.tawk_hash)
        this.$store.tawk_hash = body.tawk_hash
      }
    },
    oaLogin (p = 'github') {
      window.open(
        this.$envs.API_BASE_URL + '/login/' + p,
        'oauth-login',
        'width=960,height=600'
      )
    },
    oauthCallback (event) {
      if (
        event.origin === this.$envs.API_BASE_URL &&
        typeof event.data.token === 'string'
      ) {
        console.info('oauth', event.data)

        const was_not_logged = !this.checkLogin()

        this.setConnections(event.data.connections)

        this.setToken({ body: event.data })
        if (was_not_logged) {
          this.afterLogin()
        }
      }
    },
    tawk_auth () {
      const tawk_data = {
        name: this.$store.user.name,
        email: this.$store.user.email,
        hash: this.$store.tawk_hash
      }

      window.Tawk_API = window.Tawk_API || {}
      window.Tawk_API.visitor = tawk_data

      window.Tawk_API.setAttributes(tawk_data, function (error) {
        // @TODO log this
        // @FIXME log this
        if (error != undefined) {
          throw error
        }
      })
    }
  }
}

export default ({ Vue }) => {
  Vue.mixin(mixinLogin)
};
