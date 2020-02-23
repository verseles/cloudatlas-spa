<template>
  <q-page>
    <q-card>
      <q-tabs
        v-model="selectedTab"
        class="text-grey"
        active-color="accent"
        indicator-color="transparent"
        align="center"
        no-caps
      >
        <q-route-tab
          to="/prefs/profile"
          replace
          label="Profile"
          name="profile"
          icon="mdi-account-circle"
          :ripple="false"
        />
        <q-route-tab
          to="/prefs/connections"
          replace
          label="Connections"
          name="connections"
          icon="mdi-vector-intersection"
          :ripple="false"

        />
        <q-route-tab
          to="/prefs/billing"
          replace
          label="Billing"
          name="billing"
          icon="mdi-square-inc-cash"
          :ripple="false"

        />
      </q-tabs>

      <q-separator/>

      <q-tab-panels :value="selectedTab">
        <q-tab-panel :name="selectedTab">
          <div v-if="exists" :is="selectedTab"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
  import profile from './profile'
  import connections from './connections'
  import billing from './billing'

  export default {
    components: { connections, profile, billing },
    mounted () {
      this.selectedTab = this.$route.params.tab

      if (!this.exists) {
        this.$router.push('/prefs/' + this.tabDefault)
      }
    },
    data () {
      return {
        selectedTab: 'profile',
        tabDefault: 'profile',
      }
    },
    computed: {
      exists () {
        return this.selectedTab in this.$options.components
      }
    }
  }
</script>

<style></style>
