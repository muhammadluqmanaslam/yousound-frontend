<template>
  <div>
    <template v-if="!loading">
      <div class="my-overlay" @click="dismiss()"></div>

      <div class="box" v-if="!show_error_dialog">
        <div class="box__header">
          <h4>Payment</h4>
          <div class="close-icon" @click="dismiss()"> <img src="../assets/remove-icon.svg" width="32"></div>
        </div>
        <div class="divider my-4"></div>

        <div class="mb-2 heading">Purchase</div>

        <div class="con_container">
          <div class="dflex justify-space-between align-center">
           <div class="heading">Product purchase</div>
           <div class="heading">${{ (amount + fee) | formatNumber }}</div>

          </div>
          <div class="divider my-3"></div>
          <div class="subheading">
           Sellers have 21 days to ship your items or your order is automatically refunded.
          </div>

        </div>


        <div class="mb-2 mt-3 heading">Credit card</div>
        
        
        <div class="card-inputs">
          <!-- Using the same "my-input" class on the -->
          <!-- regular input above and on this container. -->
          <card-number
            class="stripe-element card-number payment-card"
            :class="{ complete }"
            ref="cardNumber"
            :stripe="stripe_publishable_key"
            :options="stripeOptions"
            @change="number = $event.complete"
          />

          <div class="divider"></div>

          <div class="card-box-bottom">
            <card-expiry
              class="stripe-element card-expiry payment-card"
              :class="{ complete }"
              ref="cardExpiry"
              :stripe="stripe_publishable_key"
              :options="stripeOptions"
              @change="expiry = $event.complete"
            />
            <card-cvc
              class="stripe-element card-cvc payment-card"
              :class="{ complete }"
              ref="cardCvc"
              :stripe="stripe_publishable_key"
              :options="stripeOptions"
              @change="cvc = $event.complete"
            />
          </div>
          
          <v-btn class="btn-cta" @click.native="sendPayment()">
            Pay ${{ (amount + fee) | formatNumber }}
          </v-btn>
        </div>


        
        <div class="box__content">
          <!-- <card
            class="payment-card"
            :class="{ complete }"
            :stripe="stripe_publishable_key"
            :options="stripeOptions"
            @change="complete = $event.complete"
          /> -->
        </div>
        <div class="divider my-4"></div>
        <!-- <v-btn
          class="btn-cta"
          @click.native="sendPayment()"
          :disabled="sent_payment || !complete"
          >Pay ${{ (amount + fee) | formatNumber }}</v-btn
        > -->



        <div class="box__footer">
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
import { Card, createToken, CardNumber, CardExpiry, CardCvc } from 'vue-stripe-elements'
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
    CardNumber,
    CardExpiry,
    CardCvc,
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
      loading: true,
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
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
      return this._.get(this.receiver, 'display_name', 'Receiver')
    },

    // stripeConnected() {
    //   const receiver = this._.find(
    //     this.receivers,
    //     (user) => user.stripe_connected === false
    //   )
    //   if (receiver) {
    //     this.receiver = receiver
    //     return false
    //   } else {
    //     return true
    //   }
    // },
  },

  created() {
    // if (!this.stripeConnected) {
    //   this.show_error_dialog = true
    // }

    this.loading = true
    this.show_error_dialog = false
    this.$store.dispatch('error/showLoadingActivity', true)

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

    const funcs = (this.receivers || []).map((user) =>
      UserService.checkStripeConnection(user.id).then(
        (value) => ({ status: 'fulfilled', user, value }),
        (reason) => ({ status: 'rejected', user, reason })
      )
    )
    Promise.all(funcs).then((values) => {
      const error = this._.find(values, (v) => v.status === 'rejected')

      this.loading = false
      this.$store.dispatch('error/showLoadingActivity', false)
      if (error) {
        this.receiver = error.user
        this.show_error_dialog = true
      }
    })

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
.card {
  &-title {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 10px;
    text-transform: capitalize;
  }

  &-inputs {
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08), 0px 1px 1px rgba(0, 0, 0, 0.04);
    border-radius: 8px;
  }
}
.btn-cta{
  font-size: 18px;
  font-weight: 500;
  padding: 25px 0;
}
.card-inputs {
  font-family: "DM Sans", sans-serif !important;
  padding-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #e5e5e5;
  input {
    font-family: "DM Sans", sans-serif !important;
  }
  .divider {
    border-bottom: 1px solid rgba(60, 66, 87, 0.12);
  }

  .card-number {
    border-radius: 8px 8px 0 0;
    padding: 5px 5px 5px;
  }

  .card-box-bottom {
    display: flex;
    padding-top: 5px;
    // border-radius: 8px 8px 0 0;
  
    .card-expiry,
    .card-cvc {
      width: 100%;
      padding: 5px 5px 5px;
    }
  }
}
.btn-cta {
  width: 100%;
  text-transform: none;
  box-shadow: none;
  border-radius: 3.75px;
  background-color: #000 !important;
  color: #ffffff;
  font-size: 18px;
letter-spacing: -0.6px;
height: 48px;
margin: 0;
border-radius: 50px;
font-weight: 500;
}
.my-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 55;
  background-color: rgba(0, 0, 0, 0.9);
}
.subheading{
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
}
.con_container{
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
}
.heading{
  font-weight: 600;
  color: black;
  font-size: 14px;

}
.box {
  z-index: 56;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 390px;
  padding: 0;
  max-width: 800px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  color: #000;
  box-shadow: 0 30px 55.5px 0 rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  overflow: hidden;
  padding: 20px 30px;

  &__header {
    position: relative;
    h4 {
      font-size: 24px;
    }
    p {
      font-size: 14px;
    }
    .close-icon{
      position: absolute;
      right: 0px;
      top: 4px;
      cursor: pointer;
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
    //border-top: 1px dashed #FFFFFF;

    .divider {
      width: 100%;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
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
      text-align: center;
      label {
        font-weight: 300;
      }
      span {
        margin-left: 0px;
        font-size: 20px;
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
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.1);
padding: 20px 10px;

    .payment-card {
      width: 100%;
    }
    .divider {
      width: 100%;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .input-group.input-group--selection-controls label {
      top: 3px;
    }
  }
}
</style>
