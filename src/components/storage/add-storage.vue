<template>
  <div @keydown.enter="addStorage" class="q-pa-lg">
    <q-card-section>
      <div class="text-h6">
        <span v-if="$store.fm.editingStorage">Edit cloud storage</span>
        <span v-else>Add cloud storage</span>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select class="q-mb-sm" v-model="$store.fm.addStorage.type"
                label="Select the cloud storage type"
                :options="cloudOptions" emit-value map-options/>
      <div class="q-mb-sm">
        <q-input v-model="$store.fm.addStorage.name" label="Name" placeholder="whatever you want" type="text"/>
      </div>
      <component :is="storage_component"></component>
    </q-card-section>
  </div>
</template>

<script>
  import fmAddStorageFtp from './ftp'
  import fmAddStorageSftp from './sftp'
  import fmAddStorageS3 from './s3'
  import fmAddStorageAzure from './azure'
  import fmAddStorageGdrive from './gdrive'

  export default {
    components: {
      fmAddStorageFtp, fmAddStorageSftp, fmAddStorageS3, fmAddStorageAzure, fmAddStorageGdrive
    },
    mounted () {
    },
    data () {
      return {
        cloudOptions: [
          {
            label: 'FTP',
            value: 'ftp'
          },
          {
            label: 'SFTP / SSH',
            value: 'sftp'
          },
          {
            label: 'Amazon S3',
            value: 's3'
          },
          {
            label: 'Microsoft Azure (ALPHA TEST)',
            value: 'azure'
          },
          {
            label: 'Google Drive (ALPHA TEST)',
            value: 'gdrive'
          }
        ]
      }
    },
    computed: {
      storage_component () {
        return 'fm-add-storage-' + this.$store.fm.addStorage.type
      }
    },
    methods: {}
  }
</script>

<style></style>
