import get from 'lodash/get'

const mixinDeploy = {
  methods: {
    listDeploys() {
      this.loading = true
      this.$http
          .get("deploy")
          .then(r => this.processResults(r))
          .catch((e) => {
            console.error(e)
            this.loading = false
            this.$q.notify({
                             message: "Fail to load deploys",
                             type:    "negative",
                           })
          })
    },
    deployCalls(id) {
      this.loading = true
      this.$http
          .get(`deploy/calls/${ id }`)
          .then(response => this.processResults(response))
          .catch(() => (this.loading = false))
    },
    updateDeploys(up) {
      console.dir(up)
      this.$set(this.$global.deploy, "deploys", up)
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
      const reset                      = JSON.stringify(this.$global.deploy.editingTaskReset)
      this.$global.deploy.editingTask   = JSON.parse(reset)
      this.$global.deploy.actions       = []
      this.$global.deploy.notifications = []
    },
    getTask(id) {
      let action = this.$http.get("deploy/" + id)

      this.$global.globalRefs.loaders.editDeploy = true
      action
        .then(r => {
          this.$global.deploy.editingTask                = r.data.task
          this.$global.deploy.editingTask.git_is_enabled = this.$global.deploy
                                                            .editingTask.git_is_enabled
                                                          ? true
                                                          : ""
          if (this.$global.deploy.editingTask.git_is_enabled) {
            this.repoSelected = `${ r.data.git_conn.provider }/${ this.$global.deploy.editingTask.conn_id }/${ this.$global.deploy.editingTask.repo }`
          }
          this.$global.deploy.actions       = r.data.actions
          this.$global.deploy.notifications = r.data.notifications

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
        .finally(() => (this.$global.globalRefs.loaders.editDeploy = false))
    },
    saveTask(data, next) {
      this.$global.globalRefs.loaders.editDeploy = true

      let action
      if (data.task.id) {
        // Updating
        action = this.$http.put(`deploy/${ data.task.id }`, data)
      }
      else {
        // Creating
        action = this.$http.post("deploy", data)
      }

      action
        .then(r => {
          const taskId                          = get(r, 'data.task.id', null)
          this.$global.deploy.editingTask.id     = taskId
          this.$global.deploy.editingTask.secret = taskId

          this.processResults(r)

          if (get(r, 'data.ok')) {
            next()
          }
        })
        .catch(e => {
          console.error(e)
          if (e.response.status != 422) {
            this.$q.notify({
                             message: "Could not save task",
                             type:    "negative",
                           })
          }
        })
        .finally(() => (this.$global.globalRefs.loaders.editDeploy = false))
    },
    deleteTask(id) {
      this.$global.deploy.deletingTask.push(id)
      this.$http
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
            this.$global.deploy.deletingTask.pop()
          })
          .catch(error => {
            this.$global.deploy.deletingTask.pop()

            this.$q.notify({
                             message:
                               error.response.data.message.body || "Could not delete task",
                             type: error.response.data.message.type || "negative",
                             icon: error.response.data.message.icon || "mdi-alert",
                           })
          })
    },
    triggerLink({id, secret}) {
      return id && secret ? `https://hooks.cloudatlas.id/${ id }/${ secret }` : null
    },
    deployToggle({id}) {
      this.$global.deploy.togglingTask.push(id)
      this.$http
          .get("deploy/toggle/" + id)
          .then(response => {
            this.$global.deploy.togglingTask.pop()
            this.processResults(response)
          })
          .catch(error => {
            this.$global.deploy.togglingTask.pop()

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
      this.$http
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
      let action = this.$http.get(`/deploy/trigger/${ id }/${ secret }`)

      this.$global.deploy.triggeringTask.push(id)
      action
        .then(() => {
          this.$global.deploy.triggeringTask.pop()
        })
        .catch(() => {
          this.$global.deploy.triggeringTask.pop()

          this.$q.notify({
                           message: "Could not trigger this task",
                           type:    "negative",
                         })
        })
    },
    addAction(type = "remote_command") {
      switch (type) {
        case "remote_command":
          this.$global.deploy.actions.push({
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
          this.$global.deploy.actions.push({
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
          this.$global.deploy.actions.push({
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
                                                '    "username": "cloudatlas",\n' +
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
          this.$global.deploy.notifications.push({
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
          this.$global.deploy.notifications.push({
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
