const mixinFMStorage = {
  methods: {
    listStorages() {
      this.loading = true
      this.$http
          .get('fm/storages')
          .then(response => this.updateStorages(response.data.storages))
          .catch(() => (this.loading = false))
    },
    updateStorages(up) {
      this.$global.fm.storages = up
      this.loading            = false
    },
    addStorageDataReset() {
      this.$global.fm.editingStorage = '' // must be empty if not editing
      const reset                   = JSON.stringify(this.$global.fm.addStorageReset)
      this.$global.fm.addStorage     = JSON.parse(reset)
    },
    dialogAddStorageClosed() {
      this.addStorageDataReset()
    },

    addStorage() {
      this.$global.fm.savingStorage = true
      let request,
          data                     = this.$global.fm.addStorage,
          editing                  = this.$global.fm.editingStorage

      if (editing) {
        request = this.$http.patch(`fm/storages/${ editing }`, data)
      }
      else {
        request = this.$http.post('fm/storages', data)
      }

      request
        .then(response => {
          this.$global.fm.savingStorage = false
          this.processResults(response)
        })
        .catch(() => {
          this.$global.fm.savingStorage = false
        })
    },
    dialogAddStorageOpen() {
      this.toastEncData()
      this.$global.globalRefs.modals.fmAddStorage = true
    },
    dialogAddStorageClose() {
      this.$global.globalRefs.modals.fmAddStorage = false
      this.dialogAddStorageClosed()
    },
    dialogEditStorage(id) {
      let storages = this.$global.fm.storages
      let item     = storages.findIndex(el => el.id == id)
      if (item > -1) {

        this.$global.fm.editingStorage = id
        this.$global.fm.addStorage     = storages[ item ]

        this.dialogAddStorageOpen()
      }
      else {
        this.$q.notify('What?')
      }
    },
    deleteStorage(id, done = {}) {
      this.$global.fm.deletingStorage.push(id)
      this.$http
          .delete('fm/storages/' + id)
          .then(response => {
            this.processResults(response)
            done()
          })
          .catch(() => {})
    },
    typeStorage(type) {
      switch (type) {
        case 's3':
          return {icon: 'mdi-amazon', desc: 'AWS S3', color: 'orange'}
        case 'sftp':
          return {icon: 'mdi-linux', desc: 'Secure FTP / SSH', color: 'dark'}
        case 'azure':
          return {
            icon:  'mdi-windows',
            desc:  'Microsoft Azure',
            color: 'blue',
          }
        case 'ftp':
          return {icon: 'mdi-server-network', desc: 'FTP', color: 'brown'}
        case 'gdrive':
          return {
            icon:  'mdi-google-drive',
            desc:  'Google Drive',
            color: 'green',
          }
        default:
          return {
            icon:  'fa-server-network',
            desc:  'other filesystem',
            color: 'brown',
          }
      }
    },
  },
}

export default ({Vue}) => {
  Vue.mixin(mixinFMStorage)
}
