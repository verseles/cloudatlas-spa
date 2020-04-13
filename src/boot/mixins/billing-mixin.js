const mixinBilling = {
  computed: {
    isPRO() {
      return !!this.$store.user.billing.pro
    },
  },
}

export default ({Vue}) => {
  Vue.mixin(mixinBilling)
}
