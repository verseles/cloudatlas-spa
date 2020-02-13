<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="mdi-menu"
          aria-label="Menu"
        />

        <q-toolbar-title class="text-center">
          cloudkit
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-view-dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-file-tree" />
          </q-item-section>
          <q-item-section>
            <q-item-label>File Manager</q-item-label>
            <q-item-label caption>Your files between clouds</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-webhook" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Deploy</q-item-label>
            <q-item-label caption>Automate your processes</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list class="absolute-bottom">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-cloud-upload" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Uploads</q-item-label>
            <q-item-label caption>no files in queue</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-tune" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Preferences</q-item-label>
            <q-item-label caption>Change your settings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-forum" />
          </q-item-section>
          <q-item-section>
            <q-item-label>24/7 Human Support</q-item-label>
            <q-item-label caption>Houston is here</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>insign@gmail.com</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",

  components: {},

  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>
