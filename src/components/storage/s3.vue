<template>
  <div>
    <div class="row gutter-xs">
      <div class="col q-mb-sm">
        <q-input v-model="$store.fm.addStorage.username" :error="!!$store.errors.username"
                 :label="$store.errors.username ? $store.errors.username[0] : 'Key / Username'"/>
      </div>
      <div class="col q-mb-sm">
        <q-input v-model="$store.fm.addStorage.password" label="Secret" type="password"/>
      </div>
    </div>
    <div class="row gutter-xs">
      <div class="col q-mb-sm">
        <q-select filter v-model="$store.fm.addStorage.region"
                  :label="$store.errors.region ? $store.errors.region[0] : 'Region'"
                  :options="S3Regions"
                  />
      </div>
      <div class="col q-mb-sm">
        <q-input v-model="$store.fm.addStorage.bucket" label="Bucket" type="text"/>
      </div>
    </div>
    <q-input v-model="$store.fm.addStorage.root" label="Root path (optional)"/>

  </div>
</template>

<script>

  export default {
    data () {
      return {
        S3Regions: [
          {
            label: 'US East (Ohio)',
            value: 'us-east-2'
          },
          {
            label: 'US East (N. Virginia)',
            value: 'us-east-1'
          },
          {
            label: 'US West (N. California)',
            value: 'us-west-1'
          },
          {
            label: 'US West (Oregon)',
            value: 'us-west-2'
          },
          {
            label: 'Asia Pacific (Hong Kong)',
            value: 'ap-east-1'
          },
          {
            label: 'Asia Pacific (Mumbai)',
            value: 'ap-south-1'
          },
          {
            label: 'Asia Pacific (Osaka-Local)',
            value: 'ap-northeast-3'
          },
          {
            label: 'Asia Pacific (Seoul)',
            value: 'ap-northeast-2'
          },
          {
            label: 'Asia Pacific (Singapore)',
            value: 'ap-southeast-1'
          },
          {
            label: 'Asia Pacific (Sydney)',
            value: 'ap-southeast-2'
          },
          {
            label: 'Asia Pacific (Tokyo)',
            value: 'ap-northeast-1'
          },
          {
            label: 'Canada (Central)',
            value: 'ca-central-1'
          },
          {
            label: 'Europe (Frankfurt)',
            value: 'eu-central-1'
          },
          {
            label: 'Europe (Ireland)',
            value: 'eu-west-1'
          },
          {
            label: 'Europe (London)',
            value: 'eu-west-2'
          },
          {
            label: 'Europe (Paris)',
            value: 'eu-west-3'
          },
          {
            label: 'Europe (Stockholm)',
            value: 'eu-north-1'
          },
          {
            label: 'Middle East (Bahrain)',
            value: 'me-south-1'
          },
          {
            label: 'South America (São Paulo)',
            value: 'sa-east-1'
          },
        ]
      }
    }
  }
</script>

<style></style>
