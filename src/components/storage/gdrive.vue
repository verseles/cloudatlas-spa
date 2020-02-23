<template>
  <div>
    <div class="row gutter-xs">
      <div class="col-md q-mb-sm">
        <q-input v-model="$store.fm.addStorage.username"
                 :error="!!$store.errors.username"
                 :label="$store.errors.username ? $store.errors.username[0] : 'Client ID'"
        >
          <template v-slot:append>
            <q-btn @click="helpClientID" round dense flat icon="mdi-help-circle-outline"/>
          </template>
        </q-input>
      </div>
      <div class="col-md q-mb-sm">
        <q-input v-model="$store.fm.addStorage.password" label="Client Secret" type="password"/>
      </div>
    </div>
    <div class="row">
      <div class="col q-mb-sm">
        <q-input v-model="$store.fm.addStorage.pkey" label="Refresh Token" type="password">
          <template v-slot:append>
            <q-btn @click="helpRefreshToken" round dense flat icon="mdi-help-circle-outline"/>
          </template>
        </q-input>
      </div>
    </div>
    <q-input  v-model="$store.fm.addStorage.root" label="Root folder ID (optional)" placeholder="it's not the folder name">
    </q-input>
  </div>
</template>

<script>
  import { openURL } from 'quasar'

  export default {
    data() {
      return {}
    },
    methods: {
      goTo(url) {
        openURL(url)
      },
      helpClientID() {
        this.goTo('https://github.com/ivanvermeyen/laravel-google-drive-demo/blob/master/README/1-getting-your-dlient-id-and-secret.md')
      },
      helpRefreshToken() {
        this.goTo('https://github.com/ivanvermeyen/laravel-google-drive-demo/blob/master/README/2-getting-your-refresh-token.md')
      },
    },
  }
</script>

<style></style>
