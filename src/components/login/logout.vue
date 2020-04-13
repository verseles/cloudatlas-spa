<template>
  <small
    >Something is very wrong. Please, reload the page. (mayday mayday
    mayday)</small
  >
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";

export default {
  mounted() {
    this.$http.get("user/logout");
    this.$store.token = null;
    this.$store.user = {};
    LocalStorage.clear();
    SessionStorage.clear();

    window.Tawk_API.endChat();

    this.$q.notify({
      icon: "mdi-earth",
      message: "Welcome back to Earth.",
      caption: "You have successfully signed out."
    });

    this.$router.push("/login");
  }
};
</script>
