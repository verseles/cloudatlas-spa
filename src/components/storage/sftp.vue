<template>
   <div>
      <div class="row gutter-xs">
         <div class="col q-mb-sm">
            <q-input autofocus
                     v-model="$global.fm.addStorage.host"
                     :error="!!$global.errors.host"
                     :label="$global.errors.host ? $global.errors.host[0] : 'Host'"
                     placeholder="example.com"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$global.fm.addStorage.port" type="number" label="Port"/>
         </div>
      </div>
      <div class="row gutter-xs">
         <div class="col q-mb-sm">
            <q-input v-model="$global.fm.addStorage.username"
                     :error="!!$global.errors.username"
                     :label="$global.errors.username ? $global.errors.username[0] : 'Username'"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$global.fm.addStorage.password" type="password"
                     :error="!!$global.errors.password"
                     :label="$global.errors.password ? $global.errors.password[0] : 'Password'"
            />
         </div>
      </div>
      <q-input class="q-mb-sm"
               type="textarea"
               v-model="$global.fm.addStorage.pkey"
               :error="!!$global.errors.pkey"
               :label="$global.errors.password ? $global.errors.password[0] : 'Private Key'"
               placeholder="Private key or password are optional"
               :max-height="80"
               :min-rows="3"
      />
      <q-input v-model="$global.fm.addStorage.root" label="Root path (optional)"/>

   </div>
</template>

<script>

  export default {
    mounted() {
      this.$global.fm.addStorage.port = 22
    },
    data() {
      return {}
    },
  }
</script>

<style></style>
