<template>
  <small>Something is very wrong. Please, reload the page. (mayday mayday
    mayday)
  </small>
</template>

<script>
  import { LocalStorage, SessionStorage } from "quasar"

  export default {
    mounted() {
      this.$http.get("user/logout")
      this.$global.token = null
      this.$global.user  = {}
      LocalStorage.clear()
      SessionStorage.clear()


      this.$q.notify({
                       icon:    "mdi-earth",
                       message: "Welcome back to Earth.",
                       caption: "You have successfully signed out.",
                     })
      try {
        window.Tawk_API.endChat()
      } catch (e) { } finally {
        this.$router.push("/login")
      }

    },
  }
</script>
