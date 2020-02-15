import Vue from "vue";
import axios from "axios";

const mixinFMStorage = {
  methods: {
    listStorages() {
      this.loading = true;
      axios
        .get("fm/storages")
        .then(response => this.updateStorages(response.data.storages))
        .catch(() => (this.loading = false));
    },
    updateStorages(up) {
      this.$store.fm.storages = up;
      this.loading = false;
    },
    addStorageDataReset() {
      this.$store.fm.editingStorage = ""; // must be empty if not editing
      const reset = JSON.stringify(this.$store.fm.addStorageReset);
      this.$store.fm.addStorage = JSON.parse(reset);
    },
    dialogAddStorageClosed() {
      this.addStorageDataReset();
    },

    addStorage() {
      this.$store.fm.savingStorage = true;
      let request,
        data = this.$store.fm.addStorage,
        editing = this.$store.fm.editingStorage;

      if (editing) {
        request = axios.patch(`fm/storages/${editing}`, data);
      } else {
        request = axios.post("fm/storages", data);
      }

      request
        .then(response => {
          this.$store.fm.savingStorage = false;
          this.processResults(response);
        })
        .catch(() => {
          this.$store.fm.savingStorage = false;
        });
    },
    dialogAddStorageOpen() {
      this.toastEncData();
      this.$store.globalRefs.modals.fmAddStorage = true;
    },
    dialogAddStorageClose() {
      this.$store.globalRefs.modals.fmAddStorage = false;
      this.dialogAddStorageClosed();
    },
    dialogEditStorage(id) {
      let storages = this.$store.fm.storages;
      let item = storages.findIndex(el => el.id == id);

      if (item > -1) {
        this.$store.fm.editingStorage = id;
        this.$store.fm.addStorage = storages[item];
      }
      this.dialogAddStorageOpen();
    },
    deleteStorage(id, done = {}) {
      this.$store.fm.deletingStorage.push(id);
      axios
        .delete("fm/storages/" + id)
        .then(response => {
          this.processResults(response);
          done();
        })
        .catch(() => {});
    },
    typeStorage(type) {
      switch (type) {
        case "s3":
          return { icon: "mdi-amazon", desc: "AWS S3", color: "orange" };
        case "sftp":
          return { icon: "mdi-linux", desc: "Secure FTP / SSH", color: "dark" };
        case "azure":
          return {
            icon: "mdi-windows",
            desc: "Microsoft Azure",
            color: "blue"
          };
        case "ftp":
          return { icon: "mdi-server-network", desc: "FTP", color: "brown" };
        case "gdrive":
          return {
            icon: "mdi-google-drive",
            desc: "Google Drive",
            color: "green"
          };
        default:
          return {
            icon: "fa-server-network",
            desc: "other filesystem",
            color: "brown"
          };
      }
    }
  }
};

Vue.mixin(mixinFMStorage);
