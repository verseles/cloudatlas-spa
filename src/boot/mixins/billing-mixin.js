const mixinBilling = {
  computed: {
    isPRO() {
      return !!this.$global.user.billing.pro
    },
  },
}

export default ({Vue}) => {
  Vue.mixin(mixinBilling)
}
