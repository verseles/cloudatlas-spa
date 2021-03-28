import axios      from 'axios'
import { Notify } from "quasar"

export default ({app, router, Vue, urlPath}) => {
  Vue.prototype.$http    = axios
  axios.defaults.baseURL = process.env.API_BASE_URL + "/"

  axios.defaults.headers.common[ "Authorization" ] =
    "Bearer " + app.$storage.getItem("token")


  axios.interceptors.request.use((config) => {
    config.params = config.params || {}
    const query   = new URLSearchParams(document.location.search.substring(1))

    if (query.has('gdrive')) {
      config.params[ 'gdrive' ] = query.get('gdrive')
    }
    return config
  })

  axios.interceptors.response.use(
    r => {
      app.mixinLogin.methods.updateUser(r.data)
      app.mixinMain.methods.sendNotification(r.data)

      return r
    },
    function (error) {
      const er = error.response

      app.$global.errors = er.data.errors
      app.$global.body   = er.data

      if (er.status === 401) {
        Notify.create({
                        message: "Please, login again",
                        icon:    "mdi-shield-check",
                        timeout: 2000,
                        type:    "warning",
                      })

        router.push("/logout")
      }
      else if (er.status === 422) {
        Notify.create({
                        message: er.data.message
                                 ? er.data.message
                                 : "Please, check your data",
                        icon:    "mdi-alert-circle",
                        type:    "warning",
                      })
      }

      return Promise.reject(error)
    },
  )

};
