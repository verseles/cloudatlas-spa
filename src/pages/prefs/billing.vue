<template>
  <div class="text-center">
    <div class="text-center">
      <div class="plan-title" style="text-transform:none;">Go PRO for $9/m</div>
      <p></p>
      <q-btn outline color="positive" @click="setPlan('monthly')">monthly</q-btn>&nbsp;
      <q-btn outline color="positive" @click="setPlan('yearly')">yearly (-20%)</q-btn>
      <br><br>
      <table class="pricing">
        <tr>
          <th></th>
          <th class="plan-title">Free</th>
          <th class="plan-title">Pro</th>
        </tr>
        <tr>
          <th class="plan-group">File Manager</th>
          <td>
            <q-icon name="mdi-check"/>
          </td>
          <td>
            <q-icon name="mdi-check"/>
          </td>
        </tr>
        <tr>
          <td>Storage Accounts</td>
          <td>3</td>
          <td>10</td>
        </tr>
        <tr>
          <td>Max Upload File Size</td>
          <td>100 MB</td>
          <td>1 GB</td>
        </tr>
        <tr>
          <td>Transfer Monthly</td>
          <td>200 MB</td>
          <td>200 GB</td>
        </tr>
        <tr>
          <th class="plan-group">Deploy</th>
          <td>
            <q-icon name="mdi-check"/>
          </td>
          <td>
            <q-icon name="mdi-check"/>
          </td>
        </tr>
        <tr>
          <td>Projects</td>
          <td>2</td>
          <td>10</td>
        </tr>
        <tr>
          <td>Actions per project</td>
          <td>2</td>
          <td>10</td>
        </tr>
        <tr>
          <td>Notifications per project</td>
          <td>2</td>
          <td>10</td>
        </tr>
        <tr>
          <td>Log Retention</td>
          <td>2 days</td>
          <td>30 days</td>
        </tr>


      </table>

      <vue-stripe-checkout ref="checkoutRef"
                           :image="image"
                           :name="name"
                           :description="description"
                           :currency="currency"
                           :amount="amount"
                           :allow-remember-me="false"
                           :email="$store.user.email"
                           panelLabel="Subscribe for"
                           @done="done"
                           @opened="opened"
                           @closed="closed"
                           @canceled="canceled"
      ></vue-stripe-checkout>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        image: 'statics/ck.svg',
        name: 'CloudKit PRO',
        description: 'Monthly subscription',
        currency: 'usd',
        amount: 900,
        plan: 'monthly',
      }
    },
    methods: {
      setPlan (plan = 'monthly') {
        if (plan === 'yearly') {
          this.amount = 8640
          this.plan = 'yearly'
          this.description = 'Yearly subscription (-20%)'
        } else {
          this.amount = 900
          this.plan = 'monthly'
          this.name = 'CloudKit PRO'
          this.description = 'Monthly subscription'

        }
        this.plan = plan

        this.$nextTick(() => { this.checkout() })
      },
      async checkout () {
        // token - is the token object
        // args - is an object containing the billing and shipping address if enabled
        const { token, args } = await this.$refs.checkoutRef.open()
      },
      done ({ token }) {
        this.$axios.post(`billing/subscribe`,
          { ...{ plan: this.plan }, ...{ stripe: token } })
          .then(r => console.info(r.data))
          .catch(r => this.failListing)

        // token - is the token object
        // args - is an object containing the billing and shipping address if enabled
        // do stuff...
      },
      opened () {
        // do stuff
      },
      closed () {
        // do stuff
      },
      canceled () {
        // do stuff
      },
    },
  }
</script>
<style lang="scss">
  .plan-title {
    font-family:    'Noto Serif', serif;
    font-size:      2rem;
    text-transform: uppercase;
    font-weight:    normal;
  }

  .plan-group {
    font-weight:  bold;
    font-size:    1.4rem;
    margin-top:   25px;
    text-align:   left;
    padding-left: 10px;
  }

  .pricing {
    max-width:       800px;
    margin:          1rem auto;
    text-align:      center;
    border-collapse: collapse;
    width:           100%;
    font-size:       1.3rem;

    tr {
      border:       1px dotted #808080;
      border-left:  0;
      border-right: 0;

      &:first-child {
        border-top: 0;
      }

      &:last-child {
        border: 0;
      }

      tr td {
        padding: 1rem;
      }
    }
  }

  .gopro td {
    padding: 0 !important;
  }
</style>
