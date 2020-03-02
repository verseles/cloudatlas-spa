<template>
  <q-item-section side>
    <div v-if="!$q.platform.is.mobile">
      <slot></slot>
    </div>
    <q-btn v-else-if="loading" flat readonly :ripple="false">
      <q-spinner-ios :color="alert ? 'warning' : color"></q-spinner-ios>
    </q-btn>
    <q-btn v-else flat :ripple="false" :icon="icon" :color="alert ? 'warning' : color">
      <q-menu auto-close>
        <q-list>
          <slot></slot>
        </q-list>
      </q-menu>
    </q-btn>

  </q-item-section>

</template>

<script>
  export default {
    props: {
      loading: Boolean,
      alert:   Boolean,
      color:   String,
      icon:    {
        type:    String,
        default: 'mdi-dots-vertical',
      },
    },
  }
</script>
