<template>
    <q-breadcrumbs align="center" class="linkify-path" gutter="none" active-color="white">
      <q-breadcrumbs-el :to="part(-1)" icon="mdi-home"/>

      <q-breadcrumbs-el v-for="(item, key) in parts" :key="key" :to="part(key)" :label="item" class="part"/>
    </q-breadcrumbs>
</template>

<script>
  export default {
    props:    {
      path: {
        type:     String,
        required: true,
      },
    },
    mounted() {},
    computed: {
      parts() {
        const parts = this.path.split("/").filter(String)
        return parts
      },
    },
    data() {
      return {}
    },
    methods:  {
      part(key) {
        const sid = this.$route.params.storage_id
        if (this.parts.length) {
          const part = this.parts.slice(0, key + 1).join("/")
          return `/fm/${ sid }/` + part
        }
        return `/fm/${ sid }/`
      },
    },
  }
</script>

<style lang="scss" scoped>
  a.part {
    &:hover {
      text-decoration: underline;
    }
  }
</style>

<style lang="scss">
  .linkify-path {
    > div, .q-icon {
      font-size: 80%;
    }
  }
</style>
