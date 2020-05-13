<template>
  <div class="payment-modal">
    <div class="dismiss-section" @click="dismiss()"></div>
    <v-layout class="popup-section d-flex">
      <div class="left-section">
        <div class="payment-icon"></div>
        <h4>You're almost done.</h4>
        <p>Choose your payment method<br>to complete your order.</p>
        <div class="payment-info">
          <label>Payment</label>
          <span>${{ amount | formatNumber }}</span>
        </div>
        <div class="divider"></div>
        <div class="available-info">
          <label>Available</label>
          <span>${{ currentUser.balance_amount | formatNumber }}</span>
        </div>
        <div class="fee-info">
          <label>Fee</label>
          <span v-if="payment_method == 'stripe'">${{ fee }}</span>
          <span v-else>$0</span>
        </div>
        <div class="stripe-info">
          <label>Powered by</label>
          <span>stripe</span>
        </div>
      </div>
      <div class="right-section">
        <div class="payment-section">
          <v-radio-group v-model="payment_method" hide-details row>
            <v-radio label="Balance" value="balance" :disabled="currentUser.balance_amount < amount || type == 'deposit'"></v-radio>
            <v-radio label="Credit Card" value="stripe"></v-radio>
          </v-radio-group>
          <card v-show="payment_method == 'stripe'"
            class="stripe-card pa-2"
            :class="{ complete }"
            :stripe="stripe_publishable_key"
            :options="stripeOptions"
            @change="complete = $event.complete"/>
          <div class="user-info">
            <h4>Hi, {{ currentUser.display_name }}</h4>
            <p>Here’s a quick look at your account.<br>
            Use to pay your purchase.</p>
          </div>
          <div class="balance-info">
            <h4><span>$</span>{{ currentUser.balance_amount | formatNumber }}</h4>
            <p>Available Balance</p>
          </div>
        </div>
        <div class="action-section">
          <!-- <input type="text" class="donate-amount form-control" placeholder="$0.00"> -->
          <v-btn
            class="pay-btn"
            @click.native="sendPayment()"
            :disabled="sent_payment || (payment_method=='stripe' && !complete)">Pay ${{ amount | formatNumber }}</v-btn>
        </div>
      </div>
    </v-layout>
  </div>
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
      },

      currentUser () {
        return this.$store.state.auth.user
      }
    },

    created () {
      const total = (this.amount + 30) / 0.971
      this.fee = ((total - this.amount) / 100).toFixed(2)
      if (this.currentUser.balance_amount < this.amount || this.type === 'deposit') {
        this.payment_method = 'stripe'
      }
      // console.log(this.payment_method, this.currentUser.balance_amount, this.amount, this.type)
    },

    beforeDestroy () {
    },

    methods: {
      sendPayment () {
        this.sent_payment = true
        if (this.payment_method === 'stripe') {
          createToken().then(data => {
            this.dismiss()
            this.finish(data.token)
          })
        } else {
          this.dismiss()
          this.finish(null)
        }
      }
    }
  }
</script>
