<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat
               dense
               round
               @click="leftDrawerOpen = !leftDrawerOpen"
               :icon="$store.icon || $route.meta.icon || 'mdi-menu'"
               aria-label="Menu"
        />
        <q-toolbar-title class="text-center">
          {{ $store.title || $route.meta.title || 'CloudAtlas'}}
          <linkify-path v-if="$route.name === 'fm-list-files'" :path="$store.fm.manager.path"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1"
    >
      <q-list>
        <q-item clickable to="/dashboard">
          <q-item-section avatar>
            <q-icon name="mdi-view-dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fm">
          <q-item-section avatar>
            <q-icon name="mdi-file-tree"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>File Manager</q-item-label>
            <q-item-label caption>Your files between clouds</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/deploy">
          <q-item-section avatar>
            <q-icon name="mdi-webhook"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Deploy</q-item-label>
            <q-item-label caption>Automate your processes</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list class="absolute-bottom">
        <q-item clickable @click="$store.globalRefs.modals.fileUploadModal = true">
          <uploader-group ref="uploaderGroup"/>

          <q-item-section avatar>
            <q-icon name="mdi-cloud-upload"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Uploads</q-item-label>
            <q-item-label caption>no files in queue</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item clickable to="/prefs/profile">
          <q-item-section avatar>
            <q-icon name="mdi-tune"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Preferences</q-item-label>
            <q-item-label caption>Change your settings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="maximizeTawk" :class="isChating ? 'bg-info text-white' : ''"
        >
          <q-item-section avatar :class="isChating ? 'text-white' : ''">
            <q-icon name="mdi-forum"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>24/7 Human Support</q-item-label>
            <q-item-label caption v-text="isChating ? 'Ongoing chat' : 'Houston is here'"
            ></q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/logout">
          <q-item-section avatar>
            <q-icon name="mdi-logout"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>{{ $store.user.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  import linkifyPath   from "src/components/file-manager/linkify-path"
  import uploaderGroup from "src/components/file-manager/uploader-group"

  export default {
    components: {linkifyPath, uploaderGroup},
    created() {
      this.resetData()
    },
    mounted() {
      try {
        this.tawk_auth()
      } catch (e) {
        setTimeout(() => this.tawk_auth(), 5000)
      }

      clearInterval(this.$store.globalRefs.timers.tawk_chatting)
      this.$store.globalRefs.timers.tawk_chatting = setInterval(() => {
        this.isChating = window.Tawk_API.isChatOngoing() || false
      }, 1000)
    },
    data() {
      return {
        leftDrawerOpen: false,
        isChating:      false,
        api_prefix:     process.env.API_BASE_URL,
      }
    },
    methods:    {
      maximizeTawk() {
        window.Tawk_API.maximize()
        this.tawk_auth()
      },
    },
  }
</script>
