<template>
  <q-page>
    <q-stepper v-model="step"
               ref="stepper"
               @input="$router.replace(`/deploy/edit/${$store.deploy.editingTask.id}/${step}`)"
               contractable
               alternative-labels
               :header-nav="editing"
               flat
    >
      <!-- Step: -->
      <q-step name="source" active-icon="mdi-git" title="Source">
        <div class="row q-pa-lg no-shadow">
          <div class="q-mb-lg col-md-6 offset-md-3 col-xs-12">
            <q-input v-model="$store.deploy.editingTask.title"
                     :error="!!$store.errors['task.title']"
                     placeholder="whatever you want"
                     :label="$store.errors['task.title'] ? $store.errors['task.title'][0] : 'Title'"
            />
          </div>
          <div class="q-mb-lg col-md-6 offset-md-3 col-xs-12 text-bold">
            Perform actions when
          </div>
          <div class="q-mb-lg col-md-6 offset-md-3 col-xs-12">
            <q-checkbox :value="true" label="The task link is called" disabled/>
            <q-btn v-if="triggerLink($store.deploy.editingTask)"
                   @click="copyboard(triggerLink($store.deploy.editingTask))"
                   size="sm"
                   round
                   flat
                   icon="mdi-content-copy"
                   color="secondary"
            >
              <q-tooltip>Copy</q-tooltip>
            </q-btn>
            <small v-else> (available after save)</small>
          </div>
          <div class="q-mb-lg col-md-6 offset-md-3 col-xs-12">
            <q-checkbox v-model="$store.deploy.editingTask.git_is_enabled"
                        false-value=""
                        label="A git receive a new push"
            />
          </div>
          <div v-if="$store.deploy.editingTask.git_is_enabled" class="col-xs-2 col-sm-1 col-md-1 offset-md-3 text-center">
            <q-icon class="vertical-middle" size="2.8rem" :color="ui[repoGroup.provider].color" :name="ui[repoGroup.provider].icon"/>
          </div>
          <div v-if="$store.deploy.editingTask.git_is_enabled" class="q-mb-xs col-xs-10 col-sm-11 col-md-5">
            <q-select :error="!!$store.errors['task.repo']"
                      autofocus-filter
                      filter
                      float-label="Repository"
                      :options="repoOptions"
                      v-model="repoSelected"
                      emit-value
                      map-options
            />
            <q-inner-loading :showing="loadingRepos"></q-inner-loading>
          </div>
          <div v-if="$store.deploy.editingTask.git_is_enabled"
               class="q-mb-lg col-xs-12 col-sm-11 offset-sm-1 col-md-5 offset-md-4"
          >
            <q-input v-model="$store.deploy.editingTask.branch"
                     @focus="$event.target.select()"
                     :error="!!$store.errors['task.branch']"
                     :float-label="$store.errors['task.branch'] ? $store.errors['task.branch'][0] : 'Branch'"
            />
          </div>
        </div>
      </q-step>

      <!-- Step: -->
      <q-step name="tasks" active-icon="mdi-hexagon-multiple" title="Actions">
        <div class="row q-pt-md">
          <div class="q-mb-lg col-md-8 offset-md-2 col-xs-12">
            <actions :task="$store.deploy.editingTask" :actions="$store.deploy.actions"/>
          </div>
        </div>
      </q-step>

      <!-- Step: -->
      <q-step name="notifications" active-icon="mdi-bell" title="Notifications" subtitle="">
        <div class="row q-pt-md">
          <div class="q-mb-lg col-md-8 offset-md-2 col-xs-12">
            <notifications :task="$store.deploy.editingTask" :notifications="$store.deploy.notifications"/>
          </div>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <deploy-edit-nav-btn/>
        </q-stepper-navigation>
      </template>


      <q-inner-loading :visible="$store.globalRefs.loaders.editDeploy"/>
    </q-stepper>
  </q-page>
</template>

<script>
  import actions          from 'src/components/deploy/actions'
  import notifications    from 'src/components/deploy/notifications'
  import deployEditNavBtn from 'src/components/deploy/helpers/nav-btn'

  export default {
    components: {actions, notifications, deployEditNavBtn},
    data() {
      return {
        step:         'source',
        repoList:     [],
        repoSelected: {
          repo:     '',
          provider: 'master',
          conn_id:  null,
        },
        loadingRepos: false,
        ui:           {
          unset: {icon: 'mdi-git', color: 'light'},
          github:
                 {icon: 'mdi-github-circle', color: 'dark'},
          bitbucket:
                 {icon: 'mdi-bitbucket', color: 'blue'},
        },
      }
    },
    mounted() {
      this.$store.globalRefs.steppers.editDeploy = this.$refs.stepper
      this.getRepos()
      this.listStorages()

      if (this.editing) {
        this.getTask(this.editing)
      }
    },
    beforeDestroy() {
      this.$store.subtitle = null
      this.addDeployDataReset()
    },
    watch:      {
      title(t) {
        this.$store.subtitle = t
      },
      repoSelected(r) {
        // console.info(r)
        this.$store.deploy.editingTask.repo    = this.repoGroup.repo
        this.$store.deploy.editingTask.conn_id = this.repoGroup.conn_id
      },
    },
    methods:    {
      getRepos() {
        this.loadingRepos = true

        this.$axios.get('git/repos')
            .then(r => {
              this.repoList     = r.data.repos
              this.loadingRepos = false
            })
            .catch(e => {
              this.loadingRepos = false

              this.$q.notify({
                               message: 'Could not retrieve repositories',
                               type:    'negative',
                             })
            })
      },
    },
    computed:   {
      editing() {
        return this.$route.params.id
      },
      repoOptions() {
        let repos = []
        Object.keys(this.repoList).forEach(pc => {
          const [ provider, conn_id ] = pc.split('/')

          this.repoList[ pc ].map(r => repos.push({
                                                    label:         r,
                                                    value:         `${ pc }/${ r }`,
                                                    icon:          this.ui[ provider ].icon,
                                                    leftTextColor: this.ui[ provider ].color,
                                                  }))
        })

        return repos
      },
      repoGroup() {
        if (this.repoSelected.length) {
          const [ provider, conn_id, user, repo ] = this.repoSelected.split('/')
          return {repo: `${ user }/${ repo }`, provider, conn_id}
        }
        else {
          return {repo: '', provider: 'unset', conn_id: ''}
        }
      },
    },
  }
</script>

<style>
  .q-stepper-horizontal .q-stepper-step-inner {
    padding: 0
  }
</style>
