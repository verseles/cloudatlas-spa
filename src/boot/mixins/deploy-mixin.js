const mixinDeploy = {
  methods: {
    listDeploys() {
      this.loading = true
      this.$axios
          .get("deploy")
          .then(r => this.processResults(r))
          .catch(() => {
            this.loading = false
            this.$q.notify({
                             message: "Fail to load deploys",
                             type:    "negative",
                           })
          })
    },
    deployCalls(id) {
      this.loading = true
      this.$axios
          .get(`deploy/calls/${ id }`)
          .then(response => this.processResults(response))
          .catch(() => (this.loading = false))
    },
    updateDeploys(up) {
      this.$set(this.$store.deploy, "deploys", up)
    },
    typeDeploy(task) {
      if (task.conn) {
        switch (task.conn.provider) {
          case "github":
            return {
              icon:  "mdi-github-circle",
              color: "dark",
              desc:  task.repo,
            }
          case "bitbucket":
            return {icon: "mdi-bitbucket", color: "blue", desc: task.repo}
          default:
            return {icon: "mdi-git", color: "deep-orange-5", desc: task.repo}
        }
      }
      else {
        return {
          icon:  "mdi-webhook",
          color: "primary",
          desc:  "no git enabled",
        }
      }
    },
    addDeployDataReset() {
      const reset                      = JSON.stringify(this.$store.deploy.editingTaskReset)
      this.$store.deploy.editingTask   = JSON.parse(reset)
      this.$store.deploy.actions       = []
      this.$store.deploy.notifications = []
    },
    getTask(id) {
      let action = this.$axios.get("deploy/" + id)

      this.$store.globalRefs.loaders.editDeploy = true
      action
        .then(r => {
          this.$store.deploy.editingTask                = r.data.task
          this.$store.deploy.editingTask.git_is_enabled = this.$store.deploy
                                                            .editingTask.git_is_enabled
                                                          ? true
                                                          : ""
          if (this.$store.deploy.editingTask.git_is_enabled) {
            this.repoSelected = `${ r.data.git_conn.provider }/${ this.$store.deploy.editingTask.conn_id }/${ this.$store.deploy.editingTask.repo }`
          }
          this.$store.deploy.actions       = r.data.actions
          this.$store.deploy.notifications = r.data.notifications

          if (!this.$route.params.tab) {
            this.$router.replace(this.$route.path + "/source")
          }
          else {
            this.$refs.stepper.goTo(this.$route.params.tab)
          }
        })
        .catch(e => {
          console.error('xxxxxxx', e)

          this.$router.push("/deploy")

          this.$q.notify({
                           message: "Could not retrieve this task",
                           type:    "negative",
                         })
        })
        .finally(() => (this.$store.globalRefs.loaders.editDeploy = false))
    },
    saveTask(data, next) {
      this.$store.globalRefs.loaders.editDeploy = true

      let action
      if (data.task.id) {
        // Updating
        action = this.$axios.put(`deploy/${ data.task.id }`, data)
      }
      else {
        // Creating
        action = this.$axios.post("deploy", data)
      }

      action
        .then(r => {
          this.$store.deploy.editingTask.id     = r.data?.task?.id ?? null
          this.$store.deploy.editingTask.secret = r.data?.task?.id ?? null

          this.processResults(r)

          if (r.data?.ok) {
            next()
          }
        })
        .catch(e => {
          console.info(e)
          console.error(e)
          if (e.response.status != 422) {
            this.$q.notify({
                             message: "Could not save task",
                             type:    "negative",
                           })
          }
        })
        .finally(() => (this.$store.globalRefs.loaders.editDeploy = false))
    },
    deleteTask(id) {
      this.$store.deploy.deletingTask.push(id)
      this.$axios
          .delete("deploy/" + id)
          .then(response => {
            this.processResults(response)
            const dismiss = this.$q.notify({
                                             message: "Deploy task deleted",
                                             type:    "warning",
                                             icon:    "mdi-delete-forever",
                                             timeout: 8000,
                                             actions: [
                                               {
                                                 label:   "UNDO",
                                                 handler: () => {
                                                   dismiss()
                                                   this.deployRestore({id})
                                                 },
                                               },
                                             ],
                                           })
            this.$store.deploy.deletingTask.pop()
          })
          .catch(error => {
            this.$store.deploy.deletingTask.pop()

            this.$q.notify({
                             message:
                               error.response.data.message.body || "Could not delete task",
                             type: error.response.data.message.type || "negative",
                             icon: error.response.data.message.icon || "mdi-alert",
                           })
          })
    },
    triggerLink({id, secret}) {
      return id && secret ? `https://hooks.cloudkit.app/${ id }/${ secret }` : null
    },
    deployToggle({id}) {
      this.$store.deploy.togglingTask.push(id)
      this.$axios
          .get("deploy/toggle/" + id)
          .then(response => {
            this.$store.deploy.togglingTask.pop()
            this.processResults(response)
          })
          .catch(error => {
            this.$store.deploy.togglingTask.pop()

            this.$q.notify({
                             message:
                               error.response.data.message.body || "Could change task status",
                             type: error.response.data.message.type || "negative",
                             icon: error.response.data.message.icon || "mdi-alert",
                           })
          })
    },
    deployRestore({id}) {
      this.loading = true
      this.$axios
          .get("deploy/restore/" + id)
          .then(response => {
            this.processResults(response)
          })
          .catch(error => {
            this.loading = false
            this.$q.notify({
                             message: error.response.data.message.body || "Could restore task",
                             type:    error.response.data.message.type || "negative",
                             icon:    error.response.data.message.icon || "mdi-alert",
                           })
          })
    },
    deployTrigger({id, secret}) {
      let action = this.$axios.get(`/deploy/trigger/${ id }/${ secret }`)

      this.$store.deploy.triggeringTask.push(id)
      action
        .then(() => {
          this.$store.deploy.triggeringTask.pop()
        })
        .catch(() => {
          this.$store.deploy.triggeringTask.pop()

          this.$q.notify({
                           message: "Could not trigger this task",
                           type:    "negative",
                         })
        })
    },
    addAction(type = "remote_command") {
      switch (type) {
        case "remote_command":
          this.$store.deploy.actions.push({
                                            status:  "active",
                                            type:    "remote_command",
                                            details: {
                                              code:
                                                "cd /home/my/folder\n\n" +
                                                "git pull\n\n" +
                                                "composer install\n\n" +
                                                "/usr/bin/php artisan migrate --force",
                                              servers: [],
                                            },
                                          })
          break
        case "file_operations":
          this.$store.deploy.actions.push({
                                            status:  "active",
                                            type:    "file_operations",
                                            details: {
                                              operation:      "copyFile",
                                              origin_server:  "",
                                              origin_path:    "",
                                              destiny_server: "",
                                              destiny_path:   "",
                                              contents:       "\nSmile, breathe, and go slowly. - Thich Nhat Hanh\n",
                                              overwrite:      false,
                                            },
                                          })
          break
        case "http_request":
          this.$store.deploy.actions.push({
                                            status:  "active",
                                            type:    "http_request",
                                            details: {
                                              data:
                                                "{\n" +
                                                '  "query": {\n' +
                                                '    "page": 2,\n' +
                                                '    "id": 42\n' +
                                                "  },\n" +
                                                '  "form_params": {\n' +
                                                '    "username": "ckp",\n' +
                                                '    "password": "ShyInTheEyes",\n' +
                                                '    "remember": 1\n' +
                                                "  }\n" +
                                                "}",
                                              endpoint: "https://httpbin.org/anything",
                                              method:   "post",
                                            },
                                          })
          break
        default:
          alert("Soon :}")
      }
    },
    addNotification(type = "email") {
      switch (type) {
        case "email":
          this.$store.deploy.notifications.push({
                                                  status:  "active",
                                                  type:    "email",
                                                  details: {
                                                    emails:      "",
                                                    only_error:  false,
                                                    include_log: true,
                                                  },
                                                })
          break
        case "pushbullet":
          this.$store.deploy.notifications.push({
                                                  status:  "active",
                                                  type:    "pushbullet",
                                                  details: {
                                                    token:        "",
                                                    all_devices:  true,
                                                    device_types: [ "android" ],
                                                    only_error:   false,
                                                  },
                                                })
          break
        default:
          alert("Soon :}")
      }
    },
  },
}

export default ({Vue}) => {
  Vue.mixin(mixinDeploy)
}
