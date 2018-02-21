<template>
  <v-flex xs12 sm12 class="repost-payment-modal">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 text-xs-center class="modal__header">
        <p>You are requesting a request from <span>{{ user.display_name }}</span></p>
      </v-flex>

      <v-flex xs12 class="modal__content">
        <div class="repost-item">
          <div class="repost-item-image" :style="{'background-image': 'url(' + itemCover + ')'}"></div>
          <div class="repost-item-title">{{ itemTitle }}</div>
          <div class="repost-item-owner">{{ itemOwner }}</div>
        </div>
        <div class="payment">
          <p>This user charge <strong>$1.00</strong> for repost requests.</p>
          <p>You card isn't charged unless this user choose to repost your content. Users can accept, deny, or repost for free. If the user doesn't respond in 3 days, the request is automatically denied</p>

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
          <v-flex xs12 text-xs-center class="action-section">
            <v-btn class ="pay-btn" @click.native="sendPayment()" :disabled="sent_payment || (payment_method=='stripe' && !complete)">Pay: ${{ amount | formatNumber }}</v-btn>
          </v-flex>
        </div>
      </v-flex>

      <v-flex xs12 text-xs-center class="modal__footer">
        <p>All transaction powered by <span>Stripe.com</span></p>
      </v-flex>

    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import { Card, createToken } from 'vue-stripe-elements'
  import { Filter } from '@/helper'

  export default {
    props: {
      item: {
        type: Object,
        required: true
      },

      itemType: {
        type: String,
        required: true
      },

      user: {
        type: Object,
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

      itemCover () {
        if (this.itemType === 'album') {
          return this.item.cover.url
        } else {
          let coverURL = ''
          for (let index in this.item.covers) {
            const cover = this.item.covers[index].cover
            if (cover.url) {
              coverURL = cover.url
              break
            }
          }
          return coverURL
        }
      },

      itemOwner () {
        if (this.itemType === 'album') {
          return this.item.user.display_name
        } else {
          return this.item.merchant.display_name
        }
      },

      itemTitle () {
        if (this.itemType === 'album') {
          return this.item.name
        } else {
          return this.item.name
        }
      },

      amount () {
        return this.user.repost_price
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
