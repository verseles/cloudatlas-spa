<template>
  <div class="text-center">
    <div class="text-center">
      <div class="plan-title" style="text-transform:none;">Go PRO for $9/m</div>

      <div class="row justify-center q-mt-md">
        <div v-show="paymentMethods.length" class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div class="row justify-center" v-if="paymentMethods.length == 1">
            Your default payment method
          </div>
          <div class="row justify-center" v-else>
            Select your default payment method
          </div>
          <div>
            <q-list separator>
              <q-item v-for="(method, key) in paymentMethods" :key="'method-'+key"
              >
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img :src="`statics/cc/${method.brand.toLowerCase()}.svg`">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>#### - #### - #### - {{ method.last_four }}</q-item-label>
                  <q-item-label caption>{{ method.exp_month | pad }} / {{ method.exp_year }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn @click="setDefaultPaymentMethod(method.id)"
                           size="12px"
                           :color="method.default ? 'yellow' : ''"
                           :flat="!method.default"
                           :unelevated="method.default"
                           round
                           :title="method.default ? 'This is the default payment method' : 'Click to set this as default payment method'"
                           :icon="method.default ? 'mdi-star' : 'mdi-credit-card-outline'"
                    />
                    <q-btn size="12px" @click="removePaymentMethod( method.id )" flat round icon="mdi-delete"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <div v-show="!stripe_hidden" class="row justify-center items-center q-mt-md">
        <div class="col-12">
          You can add as many cards as you like before select your plan.
        </div>
        <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div id="card-element"></div>
          <div id="card-errors" class="text-warning text-h6" role="alert">{{ addPaymentStatusError }}</div>
        </div>
      </div>
      <div class="row justify-center q-mt-md">
        <q-btn class="q-mx-xs" outline :ripple="false" :loading="checking" @click="submitPaymentMethod">Add new card
          <template v-slot:loading>
            <q-spinner-ios/>
          </template>
        </q-btn>
      </div>
      <div class="row justify-center q-mt-md">
        <div class="col" v-show="!isPRO">
          <div class="pro-text">Subscribe for <b>PRO</b></div>
          <q-btn outline class="q-mr-xs" color="positive" @click="setPlan('monthly')" title="Subscribe for $9/month">
            monthly $9
          </q-btn>
          <q-btn class="q-ml-xs"
                 outline
                 color="positive"
                 @click="setPlan('yearly')"
                 title="Subscribe for $86/year and save 20%"
          >yearly (-20%)
          </q-btn>
        </div>
        <div class="pro-user" v-show="isPRO">
          <div class="pro-text">You are a
            <b>PRO</b> user. <u>{{ thank_you }}</u>.
          </div>
          <div class="warns q-my-sm">
            <div v-show="isSolid">
              Renews at {{ subscription.renews_at | humanDate }}
            </div>
            <div v-show="subscription.trial_ends_at">
              You trial ends at {{ subscription.trial_ends_at }}.
            </div>
            <div v-show="isGracePeriod">
              You can use this wonderful space until {{ $store.user.billing.ends_at | humanDate }}.
            </div>
            <div v-show="isCancelled">
              Please come back to our universe!
            </div>
          </div>

          <q-btn class="q-mx-xs"
                 v-show="isMonthly && !isCancelled"
                 outline
                 :ripple="false"
                 color="positive"
                 @click="setPlan('yearly')"
          >Upgrade to Yearly (-20%)
          </q-btn>
          <q-btn class="q-mx-xs"
                 v-show="isYearly && !isCancelled"
                 outline
                 :ripple="false"
                 color="warning"
                 @click="setPlan('monthly')"
          >Downgrade to Monthly
          </q-btn>
          <q-btn v-show="isGracePeriod" class="q-mx-xs" outline :ripple="false" color="info" @click="resumeSubscription"
          >Resume&nbsp;<b>PRO</b>
          </q-btn>
          <q-btn v-show="isSolid" class="q-mx-xs" outline :ripple="false" color="negative" @click="cancelSubscription"
          >Cancel&nbsp;<b>PRO</b>
          </q-btn>
        </div>
        <q-inner-loading :showing="loading" color="red">
          <q-spinner-ios size="50px"/>
        </q-inner-loading>
      </div>

      <table class="pricing q-mt-xl">
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
          <td>20 MB</td>
          <td>100 MB</td>
        </tr>
        <tr>
          <td>Transfer Monthly</td>
          <td>100 MB</td>
          <td>50 GB</td>
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
  import { date, format } from 'quasar'

  const {pad} = format
  export default {
    components: {},
    filters:    {
      pad:       function (value) {
        return pad(value)
      },
      humanDate: v => {
        // YYYY-MM-DDTHH:mm:ss.ZZ\Z
        const extracted = date.extractDate(v, 'YYYY-MM-DD HH:mm:ss')
        return date.formatDate(extracted, "YYYY-MM-DD")
      },
    },
    mounted() {
      this.includeStripe('js.stripe.com/v3/', () => this.configureStripe())
      this.loadIntent()
    },
    data() {
      return {
        stripe_hidden:            true,
        checking:                 false,
        loading:                  false,
        stripe:                   '',
        elements:                 '',
        card:                     '',
        publishableKey:           process.env.STRIPE_PUB_KEY,
        intent:                   '',
        addPaymentStatus:         0,
        addPaymentStatusError:    '',
        paymentMethods:           [],
        paymentMethodsLoadStatus: 0,
        selectedPlan:             'monthly',
        userStatus:               {},
        subscription:             {},
      }
    }
    ,
    methods:    {
      /*
       Includes Stripe.js dynamically
       */
      includeStripe(URL, callback) {
        let documentTag = document, tag = 'script',
            object                      = documentTag.createElement(tag),
            scriptTag                   = documentTag.getElementsByTagName(tag)[ 0 ]
        object.src                      = '//' + URL
        if (callback) { object.addEventListener('load', e => callback(null, e), false) }
        scriptTag.parentNode.insertBefore(object, scriptTag)
      },
      /*
       Configures Stripe by setting up the elements and
       creating the card element.
       */
      configureStripe() {
        this.stripe = Stripe(this.publishableKey)

        this.elements = this.stripe.elements()

        this.card = this.elements.create('card')

        this.card.mount('#card-element')

      },
      interpretData(data) {
        if (data.new) {
          this.loadPaymentMethods()
        }
        if (data.intent) {
          this.intent = data.intent
        }
        if (data.payment_methods) {
          this.paymentMethodsLoadStatus = 2
          this.loadPaymentMethods(data.payment_methods)
        }
        if (data.subscription) {
          this.subscription = data.subscription
        }
        if (data.billing) {
          let newData
          this.$store.user.billing = data.billing
          newData                  = this.$storage.getItem('user')
          newData.user.billing     = data.billing
          this.$storage.set('user', newData)
        }
      },
      loadIntent() {
        this.loading = true
        this.$http.get('billing/intent')
            .then(r => this.interpretData(r.data))
            .catch(r => this.failListing)
            .finally(() => this.loading = false)
      },
      submitPaymentMethod() {
        if (this.stripe_hidden) {
          this.stripe_hidden = false
        }
        else {
          this.addPaymentStatus = 1
          this.checking         = true
          this.stripe.confirmCardSetup(
            this.intent.client_secret, {
              payment_method: {
                card: this.card,
              },
            })
              .then(result => {
                if (result.error) {
                  this.addPaymentStatus      = 3
                  this.addPaymentStatusError = result.error.message
                }
                else {
                  this.savePaymentMethod(result.setupIntent.payment_method)
                  this.addPaymentStatus = 2
                  this.card.clear()
                  this.addPaymentStatusError = ''
                }
              })
              .finally(() => this.checking = false)
        }
      },
      /*
       Saves the payment method for the user and
       re-loads the payment methods.
       */
      savePaymentMethod(method_id) {
        this.loading = true
        this.$http.post('billing/payments', {payment_method: method_id})
            .then(r => this.interpretData(r.data))
            .finally(() => this.loading = false)
      },
      loadPaymentMethods(pm = null) {
        if (pm) {
          this.paymentMethods = pm
        }
        else {
          this.paymentMethodsLoadStatus = 1
          this.loading                  = true
          this.$http.get('billing/payments')
              .then(r => this.interpretData(r.data))
              .finally(() => this.loading = false)
        }

      },
      removePaymentMethod(paymentID) {
        this.loading = true
        this.$http.delete('billing/payments', {
              data: {
                id: paymentID,
              },
            })
            .then(r => this.interpretData(r.data))
            .finally(() => this.loading = false)
      },
      cancelSubscription() {
        this.loading = true
        this.$http.delete('billing/subscription')
            .then(r => this.interpretData(r.data))
            .finally(() => this.loading = false)
      },
      resumeSubscription() {
        this.loading = true
        this.$http.patch('billing/subscription')
            .then(r => this.interpretData(r.data))
            .finally(() => this.loading = false)
      },
      setDefaultPaymentMethod(paymentID) {
        this.loading = true
        this.$http
            .patch('billing/payments', {id: paymentID})
            .then(r => this.interpretData(r.data))
            .finally(() => this.loading = false)
      },
      setPlan(plan = 'monthly') {
        this.selectedPlan = plan
        this.updateSubscription()
      },
      updateSubscription() {
        this.loading = true
        this.$http.put('billing/subscription', {
              selectedPlan: this.selectedPlan,
            })
            .then(r => this.interpretData(r.data))
            .finally(() => this.loading = false)
      },
    }
    , computed: {
      thank_you() {
        return this.isSolid ? 'Thank you' : 'For now'
      },
      pay_frequency() {
        return this.$store.user.billing.yearly ? 'yearly' : 'monthly'
      },
      isCancelled() {
        return this.$store.user.billing.cancelled
      },
      isGracePeriod() {
        return this.$store.user.billing.grace
      },
      isSolid() {
        return this.$store.user.billing.solid
      },
      isMonthly() {
        return this.$store.user.billing.monthly
      },
      isYearly() {
        return this.$store.user.billing.yearly
      },
    },
  }
</script>
<style lang="scss">
  /**
   * The CSS shown here will not be introduced in the Quickstart guide, but shows
   * how you can use CSS to style your Element's container.
   */
  .StripeElement {
    box-sizing: border-box;

    height: 40px;

    padding: 10px 12px;

    border: 1px solid grey;
    border-radius: 4px;
    background-color: white;
  }

  .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #CFD7DF;
  }

  .StripeElement--invalid {
    border-color: $negative;
  }

  .StripeElement--webkit-autofill {
    background-color: #FEFDE5 !important;
  }


</style>
<style lang="scss">
  .plan-title {
    font-family: 'Noto Serif', serif;
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: normal;
  }

  .pro-text {
    font-family: 'Noto Serif', serif;
    font-size: 1.6rem;
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
