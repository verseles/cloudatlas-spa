<template>
  <q-page>
    <q-file-manager @refresh="refresher" :table="$store.fm.manager.table" :base-id="$route.params.storage_id"></q-file-manager>
  </q-page>
</template>

<script>
  import QFileManager from "src/components/q-file-manager"


  export default {
    components: {
      QFileManager
    },
    mounted() {
      this.refresher();
      if (this.$q.sessionStorage.has("clipboard")) {
        const clipboard = this.$q.sessionStorage.get.item("clipboard");
        if (typeof clipboard == "object" && Object.keys(clipboard).length) {
          this.$store.fm.manager.clipboard = clipboard;
        } else {
          this.$store.fm.manager.clipboard = {};
        }
      } else {
        this.$store.fm.manager.clipboard = {};
      }
    },
    methods:    {
      refresher() {
        this.listFiles(this.$route.params.storage_id, this.$route.params.path);
      }
    },
    beforeDestroy() {
      this.$store.icon             = ''
      this.$store.title            = ''
      this.$store.subtitle         = ''
      this.$store.fm.manager.path  = "";
      this.$store.fm.manager.table = [];
    },
    data() {
      return {};
    },
    watch:      {
      $route(to, from) {
        this.listFiles(to.params.storage_id, to.params.path);
      }
    }
  };
</script>
