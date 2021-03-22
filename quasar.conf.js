/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
module.exports = function (ctx) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'store-state',
      'default-storage',
      'router-guard',
      'array-summer',
      'i18n',
      'mixins/main-mixin',
      'mixins/login-mixin',
      'mixins/billing-mixin',
      'mixins/connections-mixin',
      'mixins/deploy-mixin',
      'mixins/fm-mixin',
      'mixins/fm-storage-mixin',
      'axios',
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [ 'app.scss' ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
       'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      // 'material-icons' // optional, you are not bound to it
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'mdi-v5', // Quasar icon set
      lang:    'en-us', // Quasar language pack

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      components: [ 'QSpinnerIos' ],
      directives: [],

      // Quasar plugins
      plugins: [ 'LocalStorage', 'SessionStorage', 'Notify', 'Loading' ],
      config:  {
        loading: {
          spinner: 'QSpinnerIos',
        },
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'

      transpile: false,

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,
      env:           ctx.dev
                     ? { // so on dev we'll have
          API_BASE_URL:   'https://ca.test',
          STRIPE_PUB_KEY: 'pk_test_BFuC02EqBXWuzcCgyL82vpkX',
        }
                     : { // and on build (production):
          API_BASE_URL:   'https://api.cloudatlas.id',
          STRIPE_PUB_KEY: 'pk_live_PDCX7Uliy3qwum9iQ23US0yD',
        },

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
                                enforce: 'pre',
                                test: /\.(js|vue)$/,
                                loader: 'eslint-loader',
                                exclude: /node_modules/
                              })
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port:  8080,
      open:  true, // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions:    {}, // only for GenerateSW
      manifest:          {
        name:             'CloudAtlas',
        short_name:       'CloudAtlas',
        description:      'Web Dev Tools',
        display:          'standalone',
        orientation:      'portrait',
        background_color: '#0C507E',
        theme_color:      '#FFF',
        icons:            [
          {
            src:   'icons/icon-128x128.png',
            sizes: '128x128',
            type:  'image/png',
          },
          {
            src:   'icons/icon-192x192.png',
            sizes: '192x192',
            type:  'image/png',
          },
          {
            src:   'icons/icon-256x256.png',
            sizes: '256x256',
            type:  'image/png',
          },
          {
            src:   'icons/icon-384x384.png',
            sizes: '384x384',
            type:  'image/png',
          },
          {
            src:   'icons/icon-512x512.png',
            sizes: '512x512',
            type:  'image/png',
          },
        ],
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      id: 'app.cloudatlas.id',
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'ca',
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    },
  }
}
