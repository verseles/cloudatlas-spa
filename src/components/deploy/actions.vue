<template>
  <SortableList lockAxis="y"
                :useDragHandle="true"
                :lockToContainerEdges="true"
                :lockOffset="10"
                v-model="items"
                @input="newOrder"
  >
    <q-list>
      <action v-for="(item, index) in items"
              v-if="item.status == 'active'"
              :is="item.type"
              :index="index"
              :key="index"
              :item="item"
              @del="del(index)"
              class="an-action shadow-2 q-mb-md bg-white"
      />
      <q-item class="shadow-1 q-mb-md text-grey-5" v-else-if="item.status == 'deleted'">
        <q-item-section class="text-body1">
          Action deleted
        </q-item-section>
        <q-item-section side>
          <q-btn unelevated @click="undel(index)" color="warning">undo</q-btn>
        </q-item-section>
      </q-item>
    </q-list>

  </SortableList>
</template>

<script>
  import SortableList    from './SortableList'
  import remote_command  from './actions/remote_command'
  import http_request    from './actions/http_request'
  import file_operations from './actions/file_operations'
  import outro           from './actions/outro'


  export default {
    name:       'deploy-actions',
    components: {
      SortableList,
      remote_command,
      http_request,
      file_operations,
      outro,
    },
    props:      {
      task:    {
        type:     Object,
        required: false,
        default:  null,
      },
      actions: {
        type:     Array,
        required: false,
        default:  () => this.$global.deploy.actions || [],
      },
    },
    methods:    {
      newOrder(actions) {
        this.$global.deploy.actions = actions
      },
      del(index) {
        this.$global.deploy.actions[ index ].status = 'deleted'
      },
      undel(index) {
        this.$global.deploy.actions[ index ].status = 'active'
      },
    },
    mounted() {
      this.items = this.actions
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
