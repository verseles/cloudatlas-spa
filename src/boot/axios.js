import axios      from "axios"
import { Notify } from "quasar"

export default ({app, router, Vue}) => {
  app.$axios           = axios
  Vue.prototype.$axios = axios

  app.$axios.defaults.baseURL = process.env.API_BASE_URL + "/"

  app.$axios.defaults.headers.common[ "Authorization" ] =
    "Bearer " + app.$storage.getItem("token")

  app.$axios.interceptors.response.use(
    function (r) {
      if (r.status === 201 || r.status === 202) {
        Notify.create({
                        message: r.data.message.body ? r.data.message.body : "It worked!",
                        icon:    r.data.message.icon
                                 ? r.data.message.icon
                                 : "mdi-alert-decagram",
                        type:    r.data.message.type ? r.data.message.type : "info",
                      })
      }

      return r
    },
    function (error) {
      const er = error.response

      app.$store.errors = er.data.errors
      app.$store.body   = er.data

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
