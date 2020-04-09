<template>
  <div class="text-center">
    <div class="text-center">
      <div class="plan-title" style="text-transform:none;">Go PRO for $9/m</div>
      <div class="row justify-center">
        <div class="col-md-6 col-xs-12 col-sm-8">
          <stripe-elements ref="elementsRef"
                           :pk="publishableKey"
                           @token="tokenCreated"
                           @loading="loading = $event"
                           :image="image"
                           :name="name"
                           :description="description"
                           :currency="currency"
                           :amount="amount"
                           :allow-remember-me="false"
                           :email="$store.user.email"
                           panelLabel="Subscribe for"
          ></stripe-elements>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
  import { StripeElements } from 'vue-stripe-checkout'

  export default {
    components: {
      StripeElements,
    },
    data() {
      return {
        publishableKey: process.env.STRIPE_PUB_KEY,
        loading:        false,
        token:          null,
        charge:         null,
        image:          'statics/ck.svg',
        name:           'CloudKit PRO',
        description:    'Monthly subscription',
        currency:       'usd',
        amount:         900,
        plan:           'monthly',
      }
    },
    methods:    {
      setPlan(plan = 'monthly') {
        if (plan === 'yearly') {
          this.amount      = 8640
          this.plan        = 'yearly'
          this.description = 'Yearly subscription (-20%)'
          this.submit()
        }
        else {
          this.amount      = 900
          this.plan        = 'monthly'
          this.name        = 'CloudKit PRO'
          this.description = 'Monthly subscription'
          this.submit()
        }
        this.plan = plan
      },
      sendTokenToServer({token}) {
        this.$axios.post(`billing/subscribe`,
                         {...{plan: this.plan}, ...{stripe: token}})
            .then(r => console.info(r.data))
            .catch(r => this.failListing)

        // token - is the token object
        // args - is an object containing the billing and shipping address if enabled
        // do stuff...
      },
      submit() {
        this.$refs.elementsRef.submit()
      },
      tokenCreated(token) {
        this.token  = token
        // for additional charge objects go to https://stripe.com/docs/api/charges/object
        this.charge = {
          source:      token.card,
          amount:      this.amount,
          description: this.description,
        }
        this.sendTokenToServer(this.charge)
      },
    },
  }
</script>
<style lang="scss">
  .plan-title {
    font-family: 'Noto Serif', serif;
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: normal;
  }

  .plan-group {
    font-weight: bold;
    font-size: 1.4rem;
    margin-top: 25px;
    text-align: left;
    padding-left: 10px;
  }

  .pricing {
    max-width: 800px;
    margin: 1rem auto;
    text-align: center;
    border-collapse: collapse;
    width: 100%;
    font-size: 1.3rem;

    tr {
      border: 1px dotted #808080;
      border-left: 0;
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
