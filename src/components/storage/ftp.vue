<template>
   <div>
      <div class="row gutter-sm">
         <div class="col q-mb-sm">
            <q-input autofocus
                     v-model="$global.fm.addStorage.host"
                     :error="!!$global.errors.host"
                     :label="!!$global.errors.host ? $global.errors.host[0] : 'Host'"
                     placeholder="ftp.example.com"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$global.fm.addStorage.port" type="number" label="Port"/>
         </div>
      </div>
      <div class="row gutter-sm">
         <div class="col q-mb-sm">
            <q-input v-model="$global.fm.addStorage.username"
                     :error="!!$global.errors.username"
                     :label="!!$global.errors.username ? $global.errors.username[0] : 'Username'"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$global.fm.addStorage.password"
                     :error="!!$global.errors.password"
                     :label="!!$global.errors.password ? $global.errors.password[0] : 'Password'"
                     type="password"
            />
         </div>
      </div>
      <p class="caption q-mb-xs">Optional</p>
      <q-input v-model="$global.fm.addStorage.root" label="Root path"/>
      <br>
      <div class="row">
         <div class="col q-mb-sm">
            <q-toggle v-model="$global.fm.addStorage.passive" label="Passive"/>
         </div>
         <div class="col q-mb-sm">
            <q-toggle v-model="$global.fm.addStorage.ssl" label="SSL"/>
         </div>
      </div>
   </div>
</template>

<script>

  export default {
    mounted() {
      this.$global.fm.addStorage.port = 21
    },
    data() {
      return {}
    },
  }
</script>

<style></style>
