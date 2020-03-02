<template>
  <q-page padding>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" to='/deploy/add' icon="mdi-plus"/>
    </q-page-sticky>
    <q-inner-loading v-if="loading" :showing="loading">
      <q-spinner-puff size="10rem" color="primary"></q-spinner-puff>
    </q-inner-loading>
    <div v-else-if="!$store.deploy.deploys.length"
         class="text-center absolute-center cursor-pointer"
         @click="$router.push('/deploy/add')"
    >
      <q-icon size="6rem" color="grey-4" name="mdi-webhook"></q-icon>
      <div class="text-body1 text-grey-4">add new one?</div>
    </div>
    <q-list v-else>
      <q-item clickable v-for="task in $store.deploy.deploys" :key="task.id">
        <q-item-section avatar @click="$router.push(editLink(task.id))">
          <q-icon :name="typeDeploy(task).icon" :color="typeDeploy(task).color"/>
        </q-item-section>
        <q-item-section @click="$router.push(editLink(task.id))">
          <q-item-label>{{ task.title }}</q-item-label>
          <q-item-label caption>{{ typeDeploy(task).desc }}</q-item-label>
        </q-item-section>
        <q-dbtn-holder :loading="$store.deploy.deletingTask.includes(task.id)
                                    || $store.deploy.triggeringTask.includes(task.id)
                                    || $store.deploy.togglingTask.includes(task.id)" :alert="!task.active || $store.deploy.deletingTask.includes(task.id)
                                    || $store.deploy.triggeringTask.includes(task.id)
                                    || $store.deploy.togglingTask.includes(task.id)"
        >
          <q-dbtn label="Deploy now"
                  flat
                  color="primary"
                  icon="mdi-chemical-weapon"
                  @click="deployTrigger(task)"
                  :loading="$store.deploy.triggeringTask.includes(task.id)"
          />
          <q-dbtn label="Calls history" icon="mdi-timetable" flat color="primary" :to="`deploy/calls/${task.id}`"
          ></q-dbtn>
          <q-dbtn label="Trigger link"
                  icon="mdi-clipboard-outline"
                  flat
                  color="primary"
                  @click="copyboard(triggerLink(task))"
          ></q-dbtn>

          <q-dbtn :label="task.active ? 'Pause link' : 'Reactive link'"
                  :loading="$store.deploy.togglingTask.includes(task.id)"
                  :icon="task.active ? 'mdi-pause' : 'mdi-play'"
                  :color="task.active ? 'primary' : 'warning'"
                  :flat="task.active"
                  :outline="!task.active"
                  @click="deployToggle(task)"
          ></q-dbtn>
          <q-dbtn label="Edit details" icon="mdi-pencil" flat color="primary" :to="editLink(task.id)"
          ></q-dbtn>

          <q-dbtn label="Delete"
                  icon="mdi-delete"
                  flat
                  color="primary"
                  @click="deleteTask(task.id)"
                  :loading="$store.deploy.deletingTask.includes(task.id)"
          ></q-dbtn>
        </q-dbtn-holder>
      </q-item>
    </q-list>
  </q-page>

</template>

<script>
  import QDbtn       from 'components/q-dbtn'
  import QDbtnHolder from 'components/q-dbtn-holder'

  export default {
    components: {QDbtnHolder, QDbtn},
    mounted() {
      this.$nextTick(() => this.listDeploys())
    },
    methods:    {
      editLink: id => '/deploy/edit/' + id + '/source',
    },
    data() {
      return {
        loading: true,
      }
    },
  }
</script>

<style></style>

