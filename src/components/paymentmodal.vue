<template>
  <div>
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
          >Pay ${{ amount | formatNumber }}</v-btn
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

    <v-dialog v-else v-model="show_error_dialog" content-class="my-dialog-1">
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

export default {
  props: {
    receiver: {
      type: Object,
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
      sent_payment: false,
      complete: false,
      stripeOptions: {},
      show_error_dialog: false,
      fee: 0,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    stripeConnected() {
      return this._.get(this.receiver, 'stripe_connected', false)
    },
  },

  created() {
    if (!this.stripeConnected) {
      this.show_error_dialog = true
    }

    const total = (this.amount + 30) / 0.971
    this.fee = total - this.amount
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
  top: 0;
  left: 0;
  width: 360px;
  padding: 0;
  max-width: 800px;
  margin-top: calc(50vh - 320px);
  margin-left: auto;
  margin-right: auto;
  background-color: #3a92ff;
  color: #ffffff;
  box-shadow: 0 30px 55.5px 0 rgba(0, 0, 0, 0.3);
  border-radius: 7.5px;
  position: relative;
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
