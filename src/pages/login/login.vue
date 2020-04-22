<template>
  <q-page>
    <starfield v-if="!$q.platform.is.mobile" />
    <div class="row flex-center fullscreen">
      <div class="col"></div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <q-card class="text-center" :flat="$q.platform.is.mobile">
          <q-card-section>
            <div class="ck logo">
              <img alt="CloudAtlas logo" src="~assets/cloudatlas.id.svg" />
            </div>
            <div class="text-h3 text-primary ck name">CloudAtlas</div>
            <q-carousel
              v-model="slide"
              swipeable
              infinite
              autoplay
              padding
              animated
              control-color="primary"
              navigation
              navigation-position="top"
              navigation-icon="mdi-star"
              height="16rem"
            >
              <q-carousel-slide name="one">
                File Manager <br />for every <br />cloud filesystem
              </q-carousel-slide>
              <q-carousel-slide name="two">
                Automate <br />deploys with <br />webhooks
              </q-carousel-slide>
              <q-carousel-slide name="three">
                Transfer <br />between clouds in <br />lightning speed
              </q-carousel-slide>
            </q-carousel>
            <span class="text-bold text-grey-8 q-mr-md q-mt-lg"
              >START WITH</span
            >
            <q-btn
              color="black"
              unelevated
              @click="oaLogin('github')"
              title="Use github as login"
              class="q-mr-sm btn-login github"
            >
              <q-icon name="mdi-github-circle" />
            </q-btn>
            <q-btn
              unelevated
              class="btn-login google"
              color="red"
              @click="oaLogin('google')"
              title="Use google as login"
            >
              <q-icon name="mdi-google" />
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div class="col"></div>
      <div class="col-12 text-center absolute-bottom">
        <q-btn
          to="/about"
          flat
          size="sm"
          :ripple="false"
          color="accent"
          no-caps
          >about</q-btn
        >
        <q-btn
          to="/terms"
          flat
          size="sm"
          :ripple="false"
          color="accent"
          no-caps
          >terms</q-btn
        >
        <q-btn
          to="/privacy"
          flat
          size="sm"
          :ripple="false"
          color="accent"
          no-caps
          >privacy</q-btn
        >
        <q-btn
          @click="github"
          flat
          size="sm"
          :ripple="false"
          color="accent"
          no-caps
          >github</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { openURL } from "quasar";
import starfield from "src/components/login/starfield";

export default {
  components: { starfield },
  created() {},
  mounted() {
    if (this.checkLogin()) {
      this.afterLogin();
    }
    window.addEventListener("message", this.oauthCallback, false);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.oauthCallback, false);
  },
  data() {
    return {
      token: "",
      body: [],
      errors: [],
      loading: false,
      slide: "one"
    };
  },
  methods: {
    goTo(url) {
      openURL(url);
    },
    github() {
      this.goTo('https://github.com/cloudatlasid/spa')
    }
  },
  computed: {}
};
</script>

<style lang="scss">
.q-carousel__slide {
  font-family: "Noto Serif", serif;
  font-style: italic;
  font-size: 2rem;
  padding: 2rem 0 0;
}
</style>
