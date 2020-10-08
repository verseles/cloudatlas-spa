<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn icon="mdi-chevron-left" unelevated @click="back">back</q-btn>
        <q-toolbar-title class="text-center">
          {{ $global.title || $route.meta.title || 'CloudAtlas'}}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      back() {
        window.history.back();
      },
    },
  }
</script>
