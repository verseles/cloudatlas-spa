<template>
  <div>
    <p>Connected apps let us integrate third-party services with our system.</p>
    <div class="row q-mb-md" v-for="provider in providers" :key="provider.name">
      <div class="col-md-2 col-xs-6 text-center">
        <q-btn @click="oaLogin(provider.name)"
               class="block full-width"
               :color="provider.color"
               :label="provider.label"
               :icon="provider.icon || 'mdi-' + provider.name"
               :outline="!has(provider.name)"
        />
      </div>
      <div class=" col-md-4 col-xs-6">
        <q-btn :label="has(provider.name) ? 'Disconnect' : 'Link now'"
               flat
               :color="has(provider.name) ? 'negative' : 'dark'"
               @click="has(provider.name) ? deleteConnection(has(provider.name).id) : oaLogin(provider.name)"
               :icon="has(provider.name) ? 'mdi-link-variant-off' : 'mdi-link-variant'"
               :outline="!has(provider.name)"
               :loading="has(provider.name) ? $global.connection.deletingConn.includes(has(provider.name).id) : false"

        ></q-btn>
      </div>
    </div>
    <p>Please, note that the email should be the same, always.</p>
    <q-inner-loading :showing="$global.globalRefs.loaders.prefs">
      <q-spinner-ios
        color="primary"
        size="2em"
      />
    </q-inner-loading>
  </div>
</template>

<script>

  export default {
    mounted () {
      window.addEventListener('message', this.oauthCallback, false)

      this.getConnections()
    },
    beforeDestroy () {
      window.removeEventListener('message', this.oauthCallback, false)
    },
    data: () => ({
      providers: [
        { name: 'google', label: 'google', color: 'red' },
        { name: 'github', label: 'github', color: 'dark', icon: 'mdi-github-circle' },
        { name: 'bitbucket', label: 'bitbucket', color: 'blue' },
      ],
    }),
    methods: {
      has (provider) {
        return this.$global.connection.connections.find(c => c.provider == provider)
      },
    },
  }
</script>
