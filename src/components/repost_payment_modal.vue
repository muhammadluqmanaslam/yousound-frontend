<template>
  <div class="repost-payment-modal">
    <div class="dismiss-section" @click="dismiss()"></div>

    <v-layout row wrap class="popup-section" v-if="!show_error_dialog">
      <v-flex xs12 text-xs-center class="modal__header">
        <p>
          You are requesting a repost from
          <span>{{ receiver.display_name }}</span>
        </p>
      </v-flex>

      <v-flex xs12 class="modal__content">
        <div class="repost-item">
          <div
            class="repost-item-image"
            :style="{ 'background-image': 'url(' + itemCover + ')' }"
          ></div>
          <div class="repost-item-title">{{ itemTitle }}</div>
          <div class="repost-item-owner">{{ itemOwner }}</div>
        </div>
        <div class="payment">
          <p>
            This user charge
            <strong>${{ receiver.repost_price | formatNumber }}</strong> for
            repost requests.
          </p>
          <p>
            You card isn't charged unless this user choose to repost your
            content. Users can accept, deny, or repost for free. If the user
            doesn't respond in 1 day, the request is automatically denied
          </p>

          <v-flex xs12 class="payment-section">
            <card
              class="stripe-card pa-2"
              :class="{ complete }"
              :stripe="stripe_publishable_key"
              :options="stripeOptions"
              @change="complete = $event.complete"
            />
            <div class="fee-section pl-2 pr-2">
              <label class="fee-amount">fee: ${{ fee | formatNumber }}</label>
            </div>
          </v-flex>
          <v-flex xs12 text-xs-center class="action-section">
            <v-btn
              class="pay-btn"
              @click.native="sendPayment()"
              :disabled="sent_payment || !complete"
              >Pay: ${{ (amount + fee) | formatNumber }}</v-btn
            >
          </v-flex>
        </div>
      </v-flex>

      <v-flex xs12 text-xs-center class="modal__footer">
        <p>All transaction powered by <span>Stripe.com</span></p>
      </v-flex>
    </v-layout>

    <v-dialog
      v-else
      v-model="show_error_dialog"
      content-class="my-dialog-1"
      persistent
    >
      <v-card>
        <v-card-media
          :src="_.get(receiver, 'avatar.thumb.url')"
          height="125px"
          contain
        ></v-card-media>
        <v-card-text class="mt-2">
          <div class="headline">You cannot send the payment</div>
          <div>
            {{ _.get(receiver, 'display_name', 'Receiver') }} did not connect to
            stripe yet.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            color="blue"
            @click.native="
              show_error_dialog = false
              dismiss()
            "
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript">
import { Card, createToken } from 'vue-stripe-elements'
import { Filter } from '@/helper'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },

    itemType: {
      type: String,
      required: true,
    },

    receiver: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },

    finish: {
      type: Function,
      required: true,
    },
  },

  components: {
    Card,
  },

  data() {
    return {
      stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
      sent_payment: false,
      complete: false,
      stripeOptions: {},
      fee: 0,
      show_error_dialog: false,
    }
  },

  computed: {
    Filter() {
      return Filter
    },

    itemCover() {
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

    itemOwner() {
      if (this.itemType === 'album') {
        return this.item.user.display_name
      } else {
        return this.item.merchant.display_name
      }
    },

    itemTitle() {
      if (this.itemType === 'album') {
        return this.item.name
      } else {
        return this.item.name
      }
    },

    amount() {
      return this.receiver.repost_price
    },

    stripeConnected() {
      return this.receiver.stripe_connected
    },
  },

  created() {
    if (!this.stripeConnected) {
      this.show_error_dialog = true
    }

    const total = (this.amount + 30) / 0.971
    this.fee = total - this.amount
  },

  methods: {
    sendPayment() {
      this.sent_payment = true
      createToken().then((data) => {
        this.finish(data.token)
      })
    },
  },
}
</script>
