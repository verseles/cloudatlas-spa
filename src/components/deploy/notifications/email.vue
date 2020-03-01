<template>
  <q-item>
    <q-item-main>
      <q-item class="q-pa-none">
        <q-item-side>
          <q-item-tile>
            <q-item-tile icon="mdi-email"/>
          </q-item-tile>
        </q-item-side>
        <q-item-main class="text-bold">
          E-mail
        </q-item-main>
        <q-item-side>
          <q-item-tile>
            <q-btn @click.native="deleteme" icon="mdi-delete" title="delete" color="red-4" flat></q-btn>
          </q-item-tile>
        </q-item-side>
      </q-item>
      <q-input v-model="item.details.emails"
               float-label="E-mails separated by comma"
               placeholder="you@and.me, me@your.home"
               data-lpignore="true"
               autocomplete="off"
      />
      <q-checkbox class="q-ma-md" v-model="item.details.include_log" label="Include the log"/>
      <q-checkbox class="q-ma-md" v-model="item.details.only_error" label="Only when fail"/>
    </q-item-main>
  </q-item>
</template>

<script>
  export default {
    // name: 'ComponentName',
    props:   [ 'item' ],
    data() {
      return {}
    },
    methods: {
      deleteme() {
        this.$emit('del')
      },
    },
  }
</script>

<style></style>
