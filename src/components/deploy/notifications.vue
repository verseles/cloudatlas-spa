<template>
  <div>
    <q-list>
      <q-item class="bg-white">
        <q-item-section>
          <q-item-label overline class="text-grey">ADD</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-dbtn-holder class="q-mr-md" color="primary" icon="mdi-plus-box">
            <q-dbtn @click="addNotification('email')" label="Add e-mail" icon="mdi-email-plus" color="secondary" flat
            />
            <q-dbtn @click="addNotification('pushbullet')"
                    label="Add pushbullet"
                    icon="mdi-bullhorn"
                    color="secondary"
                    flat
            />
          </q-dbtn-holder>
        </q-item-section>

      </q-item>

      <notification v-for="(item, index) in items"
              v-if="item.status == 'active'"
              :is="item.type"
              :index="index"
              :key="index"
              :item="item"
              @del="del(index)"
              class="a-notification shadow-2 q-mb-md bg-white"
      />
      <q-item class="shadow-1 q-mb-md text-grey-5" v-else-if="item.status == 'deleted'">
        <q-item-section class="text-body1">
          Notification deleted
        </q-item-section>
        <q-item-section side>
          <q-btn unelevated @click="undel(index)" color="warning">undo</q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
  import email      from './notifications/email'
  import pushbullet from './notifications/pushbullet'
  import outro      from './actions/outro'

  import QDbtn       from 'components/q-dbtn'
  import QDbtnHolder from 'components/q-dbtn-holder'

  export default {
    name:       'deploy-notifications',
    components: {
      email,
      pushbullet,
      outro,
      QDbtn,
      QDbtnHolder,
    },
    props:      {
      task:          {
        type:     Object,
        required: false,
        default:  null,
      },
      notifications: {
        type:     Array,
        required: false,
        default:  () => this.$global.deploy.notifications || [],
      },
    },
    methods:    {
      del(index) {
        this.$global.deploy.notifications[ index ].status = 'deleted'
      },
      undel(index) {
        this.$global.deploy.notifications[ index ].status = 'active'
      },
    },
    mounted() {
      this.items = this.notifications
    },
    data() {
      return {
        items: [],
      }
    },
  }
</script>

<style scoped>

</style>
