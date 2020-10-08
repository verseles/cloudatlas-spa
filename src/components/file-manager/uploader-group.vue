<template>

  <div>
    <q-dialog v-model="$global.globalRefs.modals.fileUploadModal" @before-show="modalOpen" @hide="modalClose"
    >
      <q-card :style="{
        maxWidth: '700px', minWidth: '300px', width: '90vw',
        height: '80vh',}"
      >
        <q-toolbar>
          <q-icon name="mdi-cloud-upload" size="2rem" color="secondary"/>
          <q-toolbar-title><span class="text-weight-bold">Uploads</span></q-toolbar-title>
          <q-btn @click="stopAll()" dense flat color="negative" icon="mdi-stop-circle" :disabled="!totalFiles"
          >
            <q-tooltip>Stop all uploads</q-tooltip>
          </q-btn>
          <q-btn @click="clearAll()" flat dense :disabled="!totalFiles" icon="mdi-notification-clear-all">
            <q-tooltip>Clear upload list</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="mdi-close" v-close-popup/>
        </q-toolbar>
        <div v-if="!groups.length"
             @click="$router.push('/fm')"
             v-close-popup
             class="fixed-center text-grey-4 text-center cursor-pointer"
        >
          <h1>
            <q-icon name="mdi-upload"></q-icon>
          </h1>
          <h3>no uploads</h3>
        </div>
        <q-list v-else>
          <q-expansion-item v-for="(item, key) in groups"
                            :key="item.uid"
                            :default-opened="item.uid == $global.fm.uploads.lastUid"
                            group="uploads"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon :color="icon(item.baseId).color" :name="icon(item.baseId).icon"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ storage(item.baseId).name }}</q-item-label>
                <q-item-label caption>{{ item.path }}</q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <uploader :ref="'up-' + item.uid" :group="key" :item="item" @input="addedFile"/>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import uploader from './uploader'

  export default {
    components: {
      uploader,
    },
    data() {
      return {
        groups: [],
        files:  {},
        ups:    [],
      }
    },
    mounted() {
      this.groups = this.$global.fm.uploads.groups
    },
    methods:    {
      modalOpen() {
        this.$global.fm.uploads.someSuccess = false
        this.$global.fm.uploads.someFail    = false
      },
      modalClose() {
        const someSuccess = this.$global.fm.uploads.someSuccess
        const sid         = this.$route.params.storage_id
        const path        = this.$route.params.path
        if (someSuccess && sid && path) {
          this.listFiles(sid, path)
        }
      },
      storage(id) {
        return this.$global.fm.storages.find(el => el.id == id) || {name: '404'}
      },
      icon(id) {
        return this.typeStorage(this.storage(id).type)
      },
      addedFile(item, files) {
        this.$set(this.files, item.uid, files)
      },
      startAll() {
        this.ups.forEach(el => el.uploader.active = true)
      },
      stopAll() {
        this.ups.forEach(el => el.uploader.active = false)
      },
      clearAll() {
        this.ups.forEach(el => el.removeAll())
      },
    },
    computed:   {
      totalFiles() {
        return Object.values(this.files).reduce((a, b) => a + b.length, 0)
      },
      progress() {
        return Math.floor(this.ups.summer('progress') / this.ups.length) || 0
      },
      speed() {
        return Math.floor(this.ups.summer('speed') / this.sending) || 0
      },
      sending() {
        return this.ups.summer('sending')
      },
      filesSendingProgress() {
        return Math.floor(this.ups.summer('filesSendingProgress') / this.sending) || 0
      },
      successes() {
        return this.ups.summer('successes')
      },
      failures() {
        return this.ups.summer('failures')
      },
      in_queue() {
        return this.ups.summer('in_queue')
      },
    },
    watch:      {
      groups(old, groups) {
        this.$nextTick(() => {
          if (!old || !this.$refs || !this.groups.length || !this.$refs[ 'up-' + this.groups[ 0 ].uid ]) {
            this.ups = []
          }
          else {
            this.ups = this.groups.map(xxxx => {
              return this.$refs[ 'up-' + xxxx.uid ][ 0 ]
            })
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  .file-uploads {
    width: 100%
  }
</style>
