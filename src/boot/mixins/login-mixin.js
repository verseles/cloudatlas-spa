import axios from "axios";

export default ({ Vue, app }) => {
  const mixinLogin = {
    methods: {
      refreshToken() {
        axios.get("/token");
        // .then(r => {
        //   // @TODO make this work
        //   // console.info(r);
        // })
        // .catch(e => {
        //   // @FIXME log this
        //   // console.warn(e);
        // });
      },
      checkLogin() {
        if (this.getToken()) {
          return true;
        } else {
          return false;
        }
      },
      afterLogin() {
        if (app.$storage.has("afterLogin")) {
          this.$router.push(app.$storage.getItem("afterLogin"));
          app.$storage.remove("afterLogin");
        } else {
          this.$router.push(this.$store.afterLogin);
        }
      },
      getToken() {
        if (
          this.$store &&
          typeof this.$store.token === "string" &&
          typeof this.$store.user === "object" &&
          typeof this.$store.tawk_hash === "string"
        ) {
          console.info("aprovado rápido");
          return this.$store.token;
        } else if (app.$storage.has("token")) {
          console.info("aprovado memória");
          let token = app.$storage.getItem("token");
          let user = app.$storage.getItem("user");
          let tawk_hash = app.$storage.getItem("tawk_hash");

          this.setToken({ body: { token, user, tawk_hash } });

          return token;
        } else {
          // console.info("não aprovado");
          return null;
        }
      },
      setToken({ body }) {
        console.info("setToken", body);
        console.info(body.body);
        if (typeof body.token === "string") {
          app.$storage.set("token", body.token);
          this.$store.token = body.token;
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + body.token;

          // @TODO enable token refresh
        }
        if (typeof body.user === "object") {
          app.$storage.set("user", body.user);
          this.$store.user = body.user;
        }
        if (typeof body.tawk_hash === "string") {
          app.$storage.set("tawk_hash", body.tawk_hash);
          this.$store.tawk_hash = body.tawk_hash;
        }
      },
      oaLogin(p = "github") {
        window.open(
          process.env.API_BASE_URL + "/login/" + p,
          "oauth-login",
          "width=960,height=600"
        );
      },
      oauthCallback(event) {
        if (
          event.origin === process.env.API_BASE_URL &&
          typeof event.data.token === "string"
        ) {
          console.info("oauth", event.data);

          const was_not_logged = !this.checkLogin();

          this.setConnections(event.data.connections);

          this.setToken({ body: event.data });
          if (was_not_logged) {
            this.afterLogin();
          }
        }
      },
      tawk_auth() {
        const tawk_data = {
          name: this.$store.user.name,
          email: this.$store.user.email,
          hash: this.$store.tawk_hash
        };

        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_API.visitor = tawk_data;

        window.Tawk_API.setAttributes(tawk_data, function(error) {
          // @TODO log this
          // @FIXME log this
          if (error != undefined) {
            throw error;
          }
        });
      }
    }
  };

  Vue.mixin(mixinLogin);
};
