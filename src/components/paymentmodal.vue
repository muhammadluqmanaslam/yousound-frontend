<template>
  <v-flex xs12 sm12 class="payment-modal">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="popup-section">
      <v-layout row wrap class="top-section">
        <p class="title-label">Make Payment : ${{ amount|formatNumber }}</p>
        <label v-if="$store.state.auth.user.balance_amount<amount">Not available payment through Balance.</label>
      </v-layout>
      <v-flex xs12 class="payment-section">
        <v-radio-group v-model="payment_method" :mandatory="false" hide-details>
          <v-radio 
            :label="`Balance (Available: $${Filter.formatNumber($store.state.auth.user.balance_amount)})`"
            value="balance"
            :disabled="$store.state.auth.user.balance_amount < amount"></v-radio>
          <v-radio label="Credit Card" value="stripe"></v-radio>
          <card
            class="stripe-card pa-2"
            :class="{ complete }"
            :stripe="stripe_publishable_key"
            :options="stripeOptions"
            @change="complete = $event.complete"
            v-show="payment_method == 'stripe'"/>
        </v-radio-group>
        <div class="fee-section pl-2 pr-2" v-if="payment_method == 'stripe'">
          <label class="fee-amount">fee: ${{ fee }}</label>
        </div>
      </v-flex>
      <v-flex xs12 class="action-section">
        <!-- <input type="text" class="donate-amount form-control" placeholder="$0.00"> -->
        <v-btn class ="pay-btn" @click.native="sendPayment()" :disabled="sent_payment || (payment_method=='stripe' && !complete)">Submit</v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import { Card, createToken } from 'vue-stripe-elements'
  import { Filter } from '@/helper'

  export default {
    props: {
      type: {
        type: String,
        required: true
      },

      amount: {
        type: Number,
        required: true
      },

      dismiss: {
        type: Function,
        required: true
      },

      finish: {
        type: Function,
        required: true
      }
    },

    components: {
      Card
    },

    data () {
      return {
        stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
        payment_method: 'balance',
        sent_payment: false,
        complete: false,
        stripeOptions: {},
        fee: 0
      }
    },

    computed: {
      Filter () {
        return Filter
      }
    },

    created () {
      const total = (this.amount + 30) / 0.971
      this.fee = ((total - this.amount) / 100).toFixed(2)
      if (this.$store.state.auth.user.balance_amount < this.amount) {
        this.payment_method = 'stripe'
      }
    },

    methods: {
      sendPayment () {
        this.dismiss()
        this.sent_payment = true
        if (this.payment_method === 'stripe') {
          createToken().then(data => {
            this.finish(data.token)
          })
        } else {
          this.finish(null)
        }
      }
    }
  }
</script>
