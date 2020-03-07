<template>

  <div>
    <q-dialog v-model="$store.globalRefs.modals.fileUploadModal"
              @before-show="modalOpen"
              @hide="modalClose"
              :content-style="{minWidth: '50vw', minHeight: '50vh'}"
    >
      <q-layout container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-center">Results </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="mdi-close"/>
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
           sdfsdfsdfdfsdf
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
    <q-modal v-if="0"
             v-model="$store.globalRefs.modals.fileUploadModal"
             @open="modalOpen"
             @close="modalClose"
             :content-css="{minWidth: '80vw', minHeight: '80vh'}"
    >
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn class="no-padding" flat @click="$store.globalRefs.modals.fileUploadModal = false">
            <q-icon name="mdi-chevron-left"/>
          </q-btn>
          <q-toolbar-title>
            Uploads
          </q-toolbar-title>
          <q-btn dense flat :disabled="!totalFiles" title="Stop all uploads" @click="stopAll()">
            <q-icon name="mdi-stop-circle"/>
            <span class="desktop-only">&nbsp;Stop</span>
          </q-btn>
          <q-btn dense flat :disabled="!totalFiles" title="Clear upload list" @click="clearAll()">
            <q-icon name="mdi-delete-forever"/>
            <span class="desktop-only">&nbsp;Clear</span>
          </q-btn>
        </q-toolbar>
        <div v-if="!groups.length" class="fixed-center text-grey-4 text-center">
          <h1>
            <q-icon name="mdi-upload"></q-icon>
          </h1>
          <h2>
            no uploads </h2>
        </div>
        <q-list v-else>
          <q-collapsible v-for="(item, key) in groups"
                         :key="item.uid"
                         :opened="item.uid == $store.fm.uploads.lastUid"
                         :icon="icon(item.baseId).icon"
                         :label="storage(item.baseId).name"
                         :sublabel="item.path"
                         group="uploads"
          >
            <uploader :ref="'up-' + item.uid" :group="key" :item="item" @input="addedFile"/>
          </q-collapsible>
        </q-list>

      </q-modal-layout>
    </q-modal>
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
        layout: false,

        moreContent: true,
        drawer: false,
        drawerR: false,

        lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!'
      }
    },
    mounted() {
      this.groups = this.$store.fm.uploads.groups
    },
    methods:    {
      modalOpen() {
        this.$store.fm.uploads.someSuccess = false
        this.$store.fm.uploads.someFail    = false
      },
      modalClose() {
        const someSuccess = this.$store.fm.uploads.someSuccess
        const sid         = this.$route.params.storage_id
        const path        = this.$route.params.path
        if (someSuccess && sid && path) {
          this.listFiles(sid, path)
        }
      },
      storage(id) {
        return this.$store.fm.storages.find(el => el.id == id) || {name: '404'}
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

<style lang="stylus">
  .file-uploads
    width 100%
</style>
