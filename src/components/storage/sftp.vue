<template>
   <div>
      <div class="row gutter-xs">
         <div class="col q-mb-sm">
            <q-input autofocus
                     v-model="$store.fm.addStorage.host"
                     :error="!!$store.errors.host"
                     :label="$store.errors.host ? $store.errors.host[0] : 'Host'"
                     placeholder="example.com"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$store.fm.addStorage.port" type="number" label="Port"/>
         </div>
      </div>
      <div class="row gutter-xs">
         <div class="col q-mb-sm">
            <q-input v-model="$store.fm.addStorage.username"
                     :error="!!$store.errors.username"
                     :label="$store.errors.username ? $store.errors.username[0] : 'Username'"
            />
         </div>
         <div class="col q-mb-sm">
            <q-input v-model="$store.fm.addStorage.password" type="password"
                     :error="!!$store.errors.password"
                     :label="$store.errors.password ? $store.errors.password[0] : 'Password'"
            />
         </div>
      </div>
      <q-input class="q-mb-sm"
               type="textarea"
               v-model="$store.fm.addStorage.pkey"
               :error="!!$store.errors.pkey"
               :label="$store.errors.password ? $store.errors.password[0] : 'Private Key'"
               placeholder="Private key or password are optional"
               :max-height="80"
               :min-rows="3"
      />
      <q-input v-model="$store.fm.addStorage.root" label="Root path (optional)"/>

   </div>
</template>

<script>

  export default {
    mounted() {
      this.$store.fm.addStorage.port = 22
    },
    data() {
      return {}
    },
  }
</script>

<style></style>
