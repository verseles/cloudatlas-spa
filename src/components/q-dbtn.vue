<template>
  <q-btn v-if="!$q.platform.is.mobile"
         @click="$emit('click')"
         :color="color"
         :flat="flat"
         :outline="outline"
         :icon="icon"
         :loading="loading"
         :to="to"
  >
    <q-tooltip :offset="[0, 8]">{{ label }}</q-tooltip>
  </q-btn>
  <q-item v-else clickable :class="'text-'+color" @click.native="$emit('click')" :to="to">
    <q-spinner v-if="loading"></q-spinner>&nbsp;<q-item-section>{{ label }}</q-item-section>
  </q-item>
</template>

<script>
  export default {
    props: {
      label:   String,
      icon:    {
        type:     String,
        required: true,
      },
      flat:    Boolean,
      outline: Boolean,
      loading: Boolean,
      color:   String,
      to:      String,
    },
  }
</script>
