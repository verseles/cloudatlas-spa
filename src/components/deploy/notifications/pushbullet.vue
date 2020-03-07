<template>
  <q-list>
    <q-item>
      <q-item-section avatar>
        <q-icon name="mdi-bullhorn"/>
      </q-item-section>
      <q-item-section class="text-bold">
        Pushbullet
      </q-item-section>
      <q-item-section side>
        <div>
          <q-btn icon="mdi-key-variant" @click="goTo('https://www.pushbullet.com/#settings')" title="get a new token"
          ></q-btn>
          <q-btn @click="deleteme" dense icon="mdi-delete" color="red-4" flat></q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input v-model="item.details.token"
                 label="Pushbullet token"
                 placeholder="your pushbullet token here"
                 type="password"
                 data-lpignore="true"
                 autocomplete="off"
        />
        <br>
        <div class="row items-baseline content-center">
          <div class="col-md-6 col-sm-12 col-xs-12">
            <q-checkbox v-show="item.details.all_devices"
                        class="q-ma-md"
                        v-model="item.details.all_devices"
                        label="Send to all devices"
            />

            <q-select v-show="!item.details.all_devices"
                      float-label="Send to these devices"
                      multiple
                      v-model="item.details.device_types"
                      :options="devices_types_options"
                      emit-value
                      map-options
            />
          </div>
          <div class="col-md-6">
            <q-checkbox class="q-ma-md" v-model="item.details.only_error" label="Only when fail"/>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  import { openURL } from 'quasar'

  export default {
    props:   [ 'item' ],
    data() {
      return {
        devices_types_options: [
          {label: 'Android', value: 'android'},
          {label: 'iPhone', value: 'iphone'},
          {label: 'Chrome', value: 'chrome'},
          {label: 'Firefox', value: 'firefox'},
          {label: 'Opera', value: 'opera'},
          {label: 'Safari', value: 'safari'},
          {label: 'Vivaldi', value: 'vivaldi'},
          {label: 'Edge', value: 'edge'},
        ],
      }
    },
    methods: {
      deleteme() {
        this.$emit('del')
      },
      goTo(url) {
        openURL(url)
      },
    },
    watch:   {
      'item.details.device_types'(n) {
        if (!n.length) {
          this.item.details.all_devices = true
        }
      },
      'item.details.all_devices'(n) {
        if (!n && !this.item.details.device_types.length) {
          this.item.details.device_types = [ 'android' ]
        }
      },
    },
  }
</script>

<style></style>
