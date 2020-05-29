import { copyToClipboard, Notify } from 'quasar'

const mixinMain = {
  methods: {
    resetData() {
      this.addStorageDataReset()
      this.addDeployDataReset()
      this.$store.title = ''
    },
    processResults(response) {
      this.loading = false
      const d      = response.data || {}
      if (d.storages) {
        this.updateStorages(d.storages)
        if (d.ok) {
          this.dialogAddStorageClose()
        }
      }
      if (d.deploys) {
        this.updateDeploys(d.deploys)
      }
      if (d.connections) {
        this.setConnections(d.connections)
      }
      if (get(d, 'deploy.calls')) {
        this.deploy.calls = d.deploy.calls
      }
    },
    toastEncData() {
      this.$q.notify({
                       message: "Sensitive data is always encrypted",
                       icon:    "mdi-server-security",
                       timeout: 1000,
                       color:   "dark",
                     })
    },
    copyboard(text) {
      copyToClipboard(text)
        .then(() => {
          this.$q.notify({
                           message: "Copied",
                           timeout: 1000,
                           type:    "info",
                           icon:    "mdi-clipboard-outline",
                         })
        })
        .catch(() => {
          this.$q.notify({
                           message: "Oops!",
                           timeout: 1000,
                           type:    "error",
                           icon:    "mdi-clipboard-outline",
                         })
        })


    },
    sendNotification(data) {
      const message = get(data, 'message', null)
      if (message) {
        let notification = {
          message: get(message, 'body', 'It worked!'),
          icon:    get(message, 'icon', 'mdi-alert-decagram'),
          type:    get(message, 'type', 'info'),
          html:    get(message, 'html', false),
        }
        if (message.caption) {
          notification.caption = message.caption
        }
        Notify.create(notification)
      }
    },
  },
  mounted() {
    window.Tawk_API         = window.Tawk_API || {}
    window.Tawk_API.visitor = {
      name:  "",
      email: "",
    }
  },
}

export default ({Vue, app}) => {
  app.mixinMain = mixinMain
  Vue.mixin(mixinMain)
}
