import Vue from "vue";
import axios from "axios";

const mixinConnections = {
  methods: {
    getConnections() {
      this.loading = true;
      axios
        .get("connections")
        .then(response => this.setConnections(response.data.connections))
        .finally(() => (this.loading = false));
    },
    setConnections(connections) {
      if (typeof connections === "object") {
        this.$store.connection.connections = connections;
      }
    },
    deleteConnection(id) {
      this.$store.connection.deletingConn.push(id);
      axios
        .delete("connections/" + id)
        .then(response => {
          this.processResults(response);
        })
        .finally(() => {
          this.$store.deploy.deletingTask.pop();
        })
        .catch(error => {
          this.$q.notify({
            message:
              error.response.data.message.body || "Could not delete connection",
            type: error.response.data.message.type || "negative",
            icon: error.response.data.message.icon || "mdi-alert"
          });
        });
    }
  }
};

Vue.mixin(mixinConnections);
