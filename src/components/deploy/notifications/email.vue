<template>
  <q-list>
    <q-item>
      <q-item-section avatar>
        <q-icon name="mdi-email"/>
      </q-item-section>
      <q-item-section class="text-bold">
        E-mail
      </q-item-section>
      <q-item-section side>
        <q-btn @click="deleteme" dense icon="mdi-delete" color="red-4" flat></q-btn>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input v-model="item.details.emails"
                 label="E-mails separated by comma"
                 placeholder="you@and.me, me@your.home"
                 data-lpignore="true"
                 autocomplete="off"
        />
        <div class="row">
          <q-checkbox v-model="item.details.include_log" label="Include the log"/>
          <q-checkbox v-model="item.details.only_error" label="Only when fail"/>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
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
