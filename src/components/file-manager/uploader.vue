<template>
  <div>
    <file-upload ref="uploader"
                 multiple
                 :drop="true"
                 :thread="3"
                 :chunk-enabled="true"
                 :post-action="postAction"
                 :put-action="postAction"
                 :headers="{Authorization: 'Bearer ' + getToken()}"
                 v-model="files"
                 :data="{path: item.path}"
                 :size="50000000"
                 @input="inputed"
    >
      <div class="dnd row justify-center items-center" :class="uploader.dropActive ? 'dragging' : ''">
        <div class="col-12">&nbsp;</div>
        <div class="col-12">
          <big>Drop files here</big>
        </div>
        <div class="col-12">&nbsp;</div>
        <div class="col-12">or click to select files</div>
        <div class="col-12">&nbsp;</div>
      </div>
    </file-upload>
    <div v-if="files.length">
      <q-list>
        <q-item v-for="file in files" :key="file.id">
          <q-item-section avatar>
            <q-icon :name="icon(file)"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{file.name}}</q-item-label>
            <q-item-label caption>
              <q-linear-progress :value="uploadStatus(file).progress" :color="uploadStatus(file).color"/>
              {{ uploadStatus(file).msg }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat @click="remove(file)" icon="mdi-minus-circle"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
  import fileUpload from 'vue-upload-component'

  export default {
    components: {
      fileUpload,
    },
    props:      {
      item:  {
        type:     Object,
        required: true,
      },
      group: {
        type:     Number,
        required: true,
      },
    },
    mounted() {
      this.isMounted = true
    },
    data() {
      return {
        isMounted: false,
        files:     [],
      }
    },
    computed:   {
      api_prefix() {
        return process.env.API_BASE_URL
      },
      postAction() {
        return `${ this.api_prefix }/fm/upload/${ this.item.baseId }`
      },
      uploader() {
        return this.isMounted ? this.$refs.uploader : {}
      },
      progress() {
        return this.totalFiles ? Math.floor(this.files.reduce((a, b) => a + Number(b.progress), 0) / this.totalFiles) || 0 : 0
      },
      speed() {
        return this.sending ? Math.floor(this.files.filter(x => x.active).reduce((a, b) => a + Number(b.speed), 0) / this.sending) || 0 : 0
      },
      successes() {
        return this.files.filter(x => x.success).length
      },
      failures() {
        return this.files.filter(x => x.error).length
      },
      sending() { // Qtd
        return this.files.filter(x => x.active).length
      },
      filesSendingProgress() { // Progress
        return this.totalFiles ? Math.floor(this.files.filter(x => x.active).reduce((a, b) => a + Number(b.progress), 0)) || 0 : 0
      },
      in_queue() {
        return this.totalFiles - (this.successes + this.failures + this.sending)
      },
      totalFiles() {
        return this.files.length
      },
    },
    methods:    {
      inputed(files) {
        this.item[ 'key' ] = this.group
        this.$emit('input', this.item, files)
        this.$nextTick(() => {
          if (!this.uploader.active) {
            this.uploader.active = true
          }
        })
      },
      icon(item) {
        const ext = item.name.split('.').pop()

        if (this.icons_table[ ext ]) {
          return this.icons_table[ ext ]
        }
        else if (item.name.charAt(0) === '.') {
          return 'mdi-file-hidden'
        }

        return 'mdi-file-outline'
      },
      uploadStatus(file) {
        let progress = Number(file.progress)
        let color    = 'primary'
        let msg      = ''

        if (!file.success) {
          switch (file.error) {
            case '':
              break
            case 'network':
              color = 'negative'
              msg   = 'Please, verify your network or server limits'
              break
            case 'size':
              color    = 'warning'
              progress = 100
              msg      = 'File size is larger than the limit'
              break
            case 'extension':
              color    = 'warning'
              msg      = 'The file type is not allowed'
              progress = 100
              break
            case 'abort':
              color    = 'warning'
              msg      = 'You stopped the sending'
              progress = 100
              break
            case 'server':
              color = 'negative'
              msg   = 'The server rejected the sending'
              break
            case 'denied':
              color = 'negative'
              msg   = 'Server rejected the file'
              break
            case 'timeout':
              color = 'negative'
              msg   = 'Sending timeout'
              break
            case 'denied':
              color = 'negative'
              msg   = 'Sending aborted'
              break
            default:
              color = 'negative'
              msg   = `Unknown error (${ file.error })`
              break
          }
        }
        else { // success
          color = 'positive'
        }

        return {color, msg, progress}

      },
      remove(file) {
        this.uploader.remove(file)
      },
      removeAll() {
        this.files.forEach(file => this.uploader.remove(file))
      },
    },
  }
</script>

<style lang="scss" scoped>
  .file-uploads {
    .dnd {
      border-radius: 1rem;
      background-color: $grey-3;
      color: $grey-6;
      border: 2px solid $grey-3;

      &.dragging {
        border: 2px dotted $primary;
        color: $primary;
      }
    }

    big {
      text-transform: uppercase;
    }
  }

  table tbody {
    display: block;
    max-height: 14rem;
    overflow-y: auto;

    tr {
      display: table;
      width: 100%;
    }
  }
</style>
