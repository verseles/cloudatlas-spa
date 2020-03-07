<template>
  <div>
    <q-uploader ref="uploader"
      url="`${api_prefix}/fm/upload/${item.baseId}`"
      no-thumbnails
      multiple
      :max-file-size="50000000"
      method="POST"
      :headers="[{name: 'Authorization', value: 'Bearer ' + getToken()}]"
      :form-fields="[{name: 'path', value: item.path}]"
      @added="inputed"
    />
  </div>
</template>

<script>
  export default {
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
        this.uploader.active = true
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

<style lang="stylus" scoped>
  .file-uploads .dnd {
    border-radius: 1rem;
    background-color: $grey-3;
    color: $grey-6;
    border: 2px solid $grey-3;
  }

  .file-uploads .dnd.dragging {
    border: 2px dotted $primary;
    color: $primary;
  }

  .file-uploads big {
    text-transform: uppercase;
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
