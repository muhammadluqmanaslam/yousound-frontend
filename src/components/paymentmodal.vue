<template>
  <div>
    <template v-if="!loading">
      <div class="my-overlay" @click="dismiss()"></div>

      <div class="box" v-if="!show_error_dialog">
        <div class="box__header">
          <div class="box__icon"></div>
          <h4>You're almost done.</h4>
          <p>Fill the card detail to complete your order.</p>
        </div>

        <div class="box__content">
          <card
            class="payment-card"
            :class="{ complete }"
            :stripe="stripe_publishable_key"
            :options="stripeOptions"
            @change="complete = $event.complete"
          />
          <div class="divider"></div>
          <v-btn
            class="btn-cta"
            @click.native="sendPayment()"
            :disabled="sent_payment || !complete"
            >Pay ${{ (amount + fee) | formatNumber }}</v-btn
          >
        </div>

        <div class="box__footer">
          <div class="payment-info">
            <label>Payment</label>
            <span>${{ amount | formatNumber }}</span>
          </div>
          <div class="divider"></div>
          <div class="fee-info">
            <label>Fee</label>
            <span>${{ fee | formatNumber }}</span>
          </div>
          <div class="stripe-info">
            <label>Powered by</label>
            <span>stripe</span>
          </div>
        </div>
      </div>

      <v-dialog
        v-else
        v-model="show_error_dialog"
        content-class="my-dialog-1"
        persistent
      >
        <v-card>
          <v-card-media
            v-if="receiverAvatar"
            :src="receiverAvatar"
            height="125px"
            contain
          ></v-card-media>
          <v-card-text class="mt-2">
            <div class="headline">You cannot send the payment</div>
            <div>{{ receiverName }} did not connect to stripe yet.</div>
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
    </template>
  </div>
</template>

<script type="text/javascript">
import { Card, createToken } from 'vue-stripe-elements'
import UserService from '@/services/user'
import { Stripe } from '@/helper'

export default {
  props: {
    // receiver: {
    //   type: Object,
    // },

    receivers: {
      type: Array,
    },

    amount: {
      type: Number,
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
      receiver: {},
      sent_payment: false,
      complete: false,
      stripeOptions: {},
      show_error_dialog: false,
      fee: 0,
      loading: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    receiverAvatar() {
      return this._.get(this.receiver, 'avatar.thumb.url')
    },

    receiverName() {
      return _.get(this.receiver, 'display_name', 'Receiver')
    },

    stripeConnected() {
      const receiver = this._.find(
        this.receivers,
        (user) => user.stripe_connected === false
      )
      if (receiver) {
        this.receiver = receiver
        return false
      } else {
        return true
      }
    },
  },

  created() {
    if (!this.stripeConnected) {
      this.show_error_dialog = true
    }

    // this.loading = true
    // this.show_error_dialog = false
    // this.$store.dispatch('error/showLoadingActivity', true)

    // const funcs = (this.receivers || []).map((user) =>
    //   UserService.checkStripeConnection(user.id)
    // )
    // Promise.all(funcs)
    //   .then((values) => {
    //     this.loading = false
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //   })
    //   .catch((reason) => {
    //     this.loading = false
    //     this.show_error_dialog = true
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //   })

    // const funcs = (this.receivers || []).map((user) =>
    //   UserService.checkStripeConnection(user.id).then(
    //     (value) => ({ status: 'fulfilled', user, value }),
    //     (reason) => ({ status: 'rejected', user, reason })
    //   )
    // )
    // Promise.all(funcs).then((values) => {
    //   const error = this._.find(values, (v) => v.status === 'rejected ')
    //   this.loading = false
    //   this.$store.dispatch('error/showLoadingActivity', false)
    //   if (error) {
    //     this.receiver = error.user
    //   }
    // })

    this.fee = Stripe.calculateFee(this.amount)
  },

  beforeDestroy() {},

  methods: {
    sendPayment() {
      this.sent_payment = true
      createToken().then((data) => {
        this.dismiss()
        this.finish(data.token)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.my-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}

.box {
  z-index: 20;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  padding: 0;
  max-width: 800px;
  transform: translate(-50%, -50%);
  background-color: #3a92ff;
  color: #ffffff;
  box-shadow: 0 30px 55.5px 0 rgba(0, 0, 0, 0.3);
  border-radius: 7.5px;
  overflow: hidden;

  &__header {
    h4 {
      margin: 10px 30px 0 30px;
      font-size: 24px;
    }
    p {
      margin: 0px 30px 0px 30px;
      font-size: 14px;
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    margin: 40px 30px 20px 30px;
    background: url('/static/images/ic_payment.png') no-repeat center center;
    background-size: contain;
  }

  &__footer {
    padding: 20px 30px;
    //border-top: 1px dashed #FFFFFF;

    .divider {
      margin: 5px 0;
      border-top: 1px dashed #ffffff;
    }
    .payment-info {
      label {
        font-size: 18px;
        font-weight: 700;
      }
      span {
        float: right;
        font-size: 18px;
        font-weight: 700;
      }
    }
    .fee-info {
      label {
        display: inline-block;
        width: 100px;
        font-weight: 500;
      }
      span {
        float: right;
        font-weight: 700;
      }
    }
    .stripe-info {
      margin: 20px 0 0 0;
      text-align: right;
      label {
        font-weight: 300;
      }
      span {
        margin-left: 10px;
        font-size: 36px;
        font-weight: 700;
        font-family: 'Work Sans';
        letter-spacing: -1.5px;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius: 15px;
    background: #ffffff;

    .payment-card {
      width: 100%;
      margin: 40px 0 20px;
      padding: 8px 24px;
    }
    .divider {
      width: 320px;
      border-bottom: 1px solid #e1e1e1;
    }
    .btn {
      width: 200px;
      margin: 30px 0 30px;
      text-transform: none;
      box-shadow: none;
      border: 1px solid #e1e1e1;
      border-radius: 3.75px;
      background-color: #3a92ff !important;
      color: #ffffff;
      font-size: 15px;
      letter-spacing: -0.6px;
    }
    .input-group.input-group--selection-controls label {
      top: 3px;
    }
  }
}
</style>
