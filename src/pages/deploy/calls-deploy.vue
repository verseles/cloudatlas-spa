<template>
  <q-page>
    <q-table class="no-shadow"
             separator="none"
             :data="tableData"
             :filter="filter"
             :visible-columns="visibleColumns"
             :columns="columns"
             row-key="id"
             :pagination.sync="pagination"
    >
      <template v-slot:top-left>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="mdi-magnify"/>
          </template>
        </q-input>
      </template>
      <template v-slot:top-right="props">
        <q-select v-model="visibleColumns"
                  multiple
                  outlined
                  dense
                  options-dense
                  :display-value="$q.lang.table.columns"
                  emit-value
                  map-options
                  :options="columns"
                  option-value="name"
                  options-cover
                  style="min-width: 150px"
        />
        <q-btn flat
               round
               dense
               :icon="props.inFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
               @click="props.toggleFullscreen"
               class="q-ml-md"
        />
      </template>
      <template v-slot:body="props">
        <q-td key="origin" :props="props" :title="props.row.origin">
          <q-icon :name="props.row.origin | bestIcon" size="1.5rem"/>
        </q-td>
        <q-td key="agent" :props="props" :title="props.row.agent">
          <q-icon :name="props.row.agent | bestIcon" size="1.5rem"/>
        </q-td>
        <q-td key="event" :props="props" :title="props.row.event">
          <q-icon :name="props.row.event | bestIcon" size="1.5rem"/>
        </q-td>

        <q-td key="started" :props="props">
          <span>{{ props.row.started | dateFormat }}</span>
        </q-td>
        <q-td key="finished" :props="props">
          <span>{{ props.row.finished | dateFormat }}</span>
        </q-td>

        <q-td key="message" :props="props">
        <span class="ellipsis">
          {{ props.row.message }}
          <q-tooltip>
            {{ props.row.message }}
          </q-tooltip>
        </span>
        </q-td>
        <q-td key="log" :props="props">
          <q-btn :color="props.row.success | betterColor " size="sm" @click="showLongModal(props.row.log, 'Results')"
          >LOG
          </q-btn>
        </q-td>
        <q-td key="request" :props="props">
          <q-btn color="secondary" size="sm" @click="showLongModal(props.row.request, 'Request')">VIEW</q-btn>
        </q-td>
        <q-td key="response" :props="props">
          <q-btn color="tertiary" size="sm" @click="showLongModal(props.row.response, 'Response')">VIEW</q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="longModal.opened">
      <q-card>
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <div class="text-h6">{{ longModal.title }}</div>
            </div>
            <div class="col text-right">
              <q-btn icon="mdi-close" dense flat v-close-popup></q-btn>
            </div>
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="max-height: 50vh" class="scroll">
          <div v-if="longModal.opened" class="q-pa-md">
            <vue-json-pretty :data="longModal.json"
                             :deep="3"
                             showLength
                             :showDoubleQuotes="false"
                             highlightMouseoverNode
                             highlightSelectedNode
            ></vue-json-pretty>
          </div>
        </q-card-section>

        <q-separator/>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import { date }      from 'quasar'
  import VueJsonPretty from 'vue-json-pretty'

  export default {
    components: {
      VueJsonPretty,
    },
    mounted() {
      if (this.$q.platform.is.mobile) {
        this.visibleColumns = [ 'log', 'started', 'finished' ]
      }
      this.deployCalls(this.$route.params.id)
    },
    data:       () => ({
      longModal:      {
        opened: false,
        json:   {},
        title:  '',
      },
      visibleColumns: [ 'started', 'finished', 'log', 'agent', 'origin', 'event', 'branch', 'message' ],
      filter:         '',
      pagination:     {
        sortBy:      'created_at',
        descending:  true,
        page:        1,
        rowsPerPage: 15,
      },
      columns:        [
        {
          name:     'log',
          label:    'Result',
          align:    'left',
          field:    'log',
          sortable: false,
        },
        {
          name:     'started',
          label:    'Started',
          align:    'left',
          field:    'started',
          sortable: true,
        },
        {
          name:     'finished',
          label:    'Finished',
          align:    'left',
          field:    'finished',
          sortable: true,
        },
        {
          name:     'success',
          label:    'Success',
          align:    'left',
          field:    'success',
          sortable: true,
        },
        {
          name:     'origin',
          label:    'Origin',
          align:    'left',
          field:    'origin',
          sortable: true,
        },
        {
          name:     'agent',
          label:    'Agent',
          align:    'left',
          field:    'agent',
          sortable: true,
        },
        {
          name:     'event',
          label:    'Event',
          align:    'left',
          field:    'event',
          sortable: true,
        },
        {
          name:     'branch',
          label:    'Branch',
          align:    'left',
          field:    'branch',
          sortable: true,
        },
        {
          name:     'message',
          label:    'Message',
          align:    'left',
          field:    'message',
          sortable: true,
        },
        {
          name:     'request',
          label:    'Request',
          align:    'left',
          field:    'request',
          sortable: false,
        },
        {
          name:     'response_code',
          label:    'Response Code',
          align:    'left',
          field:    'response_code',
          sortable: true,
        },
        {
          name:     'response',
          label:    'Response',
          align:    'left',
          field:    'response',
          sortable: false,
        },
      ],
      deploy:         {
        calls: [],
      },
    }),
    computed:   {
      tableData() {
        return this.deploy.calls
      },
    },
    filters:    {
      dateFormat:  function (v) {
        return v ? date.formatDate(v * 1000, 'YYYY-MM-DD HH:mm:ss') : '-'
      },
      betterColor: function (v) {
        return v === true ? 'positive' : v === false ? 'negative' : 'tertiary'
      },
      bestIcon(txt) {
        switch (txt) {
          case 'web':
            return 'mdi-web'
            break
          case 'owner':
            return 'mdi-account-check'
            break
          case 'git':
            return 'mdi-git'
            break
          case 'github':
            return 'mdi-github-face'
            break
          case 'push':
            return 'mdi-source-pull'
            break
          case 'bitbucket':
            return 'mdi-bitbucket'
            break
          default:
            return 'mdi-alert-circle-outline'
            break
        }
      },
    },
    methods:    {
      showLongModal(json, title) {
        this.longModal.json   = json
        this.longModal.opened = true
        this.longModal.title  = title
      },
    },
  }
</script>

<style></style>
