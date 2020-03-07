export default ({Vue}) => {
  Vue.prototype.$envs = {
    API_BASE_URL:   process.env.API_BASE_URL ?? 'https://api.cloudkit.app',
    STRIPE_PUB_KEY: process.env.STRIPE_PUB_KEY ?? 'pk_live_PDCX7Uliy3qwum9iQ23US0yD',
  }
}
