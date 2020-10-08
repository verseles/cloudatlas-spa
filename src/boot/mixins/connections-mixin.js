const mixinConnections = {
  methods: {
    getConnections () {
      this.$global.globalRefs.loaders.prefs = true
      this.$http
        .get('connections')
        .then(response => this.setConnections(response.data.connections))
        .finally(() => (this.$global.globalRefs.loaders.prefs = false))
    },
    setConnections (connections) {
      if (typeof connections === 'object') {
        this.$global.connection.connections = connections
      }
    },
    deleteConnection (id) {
      this.$global.connection.deletingConn.push(id)
      this.$http
        .delete('connections/' + id)
        .then(response => {
          this.processResults(response)
        })
        .finally(() => {
          this.$global.deploy.deletingTask.pop()
        })
        .catch(error => {
          this.$q.notify({
            message:
              error.response.data.message.body || 'Could not delete connection',
            type: error.response.data.message.type || 'negative',
            icon: error.response.data.message.icon || 'mdi-alert'
          })
        })
    }
  }
}
export default ({ Vue }) => {
  Vue.mixin(mixinConnections)
}
