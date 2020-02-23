const mixinMain = {
  methods: {
    resetData() {
      this.addStorageDataReset();
      this.addDeployDataReset();
      this.$store.title = ''
    },
    processResults(response) {
      this.loading = false;
      const d = response.data || {};
      if (d.message) {
        this.$q.notify({
          message: d.message.body,
          icon: d.message.icon ? d.message.icon : "mdi-alert-octagon",
          type: d.message.type || "info"
        });
      }

      if (d.storages) {
        this.updateStorages(d.storages);
        if (d.ok) {
          this.dialogAddStorageClose();
        }
      }
      if (d.deploys) {
        this.updateDeploys(d.deploys);
      }
      if (d.connections) {
        this.setConnections(d.connections);
      }
      if (d.deploy?.calls) {
        this.deploy.calls = d.deploy.calls;
      }
    },
    toastEncData() {
      this.$q.notify({
        message: "Sensitive data is always encrypted",
        icon: "mdi-server-security",
        timeout: 1000,
        color: "dark"
      });
    }
  },
  mounted() {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.visitor = {
      name: "",
      email: ""
    };
  }
};

export default ({ Vue }) => {
  Vue.mixin(mixinMain);
}
