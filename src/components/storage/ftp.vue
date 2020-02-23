<template>
   <div>
      <div class="row gutter-sm">
         <div class="col q-mb-sm">
            <q-input autofocus
                     v-model="$store.fm.addStorage.host"
                     :error="!!$store.errors.host"
                     :label="!!$store.errors.host ? $store.errors.host[0] : 'Host'"
                     placeholder="ftp.example.com"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$store.fm.addStorage.port" type="number" label="Port"/>
         </div>
      </div>
      <div class="row gutter-sm">
         <div class="col q-mb-sm">
            <q-input v-model="$store.fm.addStorage.username"
                     :error="!!$store.errors.username"
                     :label="!!$store.errors.username ? $store.errors.username[0] : 'Username'"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$store.fm.addStorage.password"
                     :error="!!$store.errors.password"
                     :label="!!$store.errors.password ? $store.errors.password[0] : 'Password'"
                     type="password"
            />
         </div>
      </div>
      <p class="caption q-mb-xs">Optional</p>
      <q-input v-model="$store.fm.addStorage.root" label="Root path"/>
      <br>
      <div class="row">
         <div class="col q-mb-sm">
            <q-toggle v-model="$store.fm.addStorage.passive" label="Passive"/>
         </div>
         <div class="col q-mb-sm">
            <q-toggle v-model="$store.fm.addStorage.ssl" label="SSL"/>
         </div>
      </div>
   </div>
</template>

<script>

  export default {
    mounted() {
      this.$store.fm.addStorage.port = 21
    },
    data() {
      return {}
    },
  }
</script>

<style></style>
