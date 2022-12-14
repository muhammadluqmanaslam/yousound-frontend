<template>
  <div>
    <template>
      <div class="my-overlay" @click="dismiss()"></div>
      <div class="box">
        <div class="box__header">
          <div class="box__icon"></div>
          <h4>You're almost done.</h4>
          <p>Fill the card detail to complete your subscription.</p>
        </div>
        <div class="credit-card-inputs">
          <!-- Using the same "my-input" class on the -->
          <!-- regular input above and on this container. -->
          <card-number class='stripe-element card-number payment-card'
            :class="{ complete }"
            ref='cardNumber'
            :stripe='stripePubkey'
            :options='options'
            @change='number = $event.complete'
          />
          <div class="card-box-bottom">
            <card-expiry class='stripe-element card-expiry payment-card'
              :class="{ complete }"
              ref='cardExpiry'
              :stripe='stripePubkey'
              :options='options'
              @change='expiry = $event.complete'
            />
            <card-cvc class='stripe-element card-cvc payment-card'
              :class="{ complete }"
              ref='cardCvc'
              :stripe='stripePubkey'
              :options='options'
              @change='cvc = $event.complete'
            />
            <div class="divider"></div>
            <v-btn
              class="btn-cta"
              @click="paymentMethod()"
              :disabled="!complete"
              >Pay ${{ (finalAmount)}}</v-btn
            >
          </div>
        </div>

        <div class="box__footer">
          
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.my-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
.credit-card-inputs {
  margin-top: 20px;
}
.card-box-bottom {
  width: 83%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
}
.card-number,
.card-expiry,
.card-cvc {
  border: none;
  width: 83%;
  margin: auto;
  padding: 10px;
  color: #000;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
}
.card-expiry {
  width: 54%;
}
.card-cvc {
  width: 42%;
  margin-left: 10px;
}
.card-box-bottom button {
  width: 100%;
  font-size: 16px;
  padding: 26px;
  border-radius: 4px;
  margin: 5px 0 0;
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
.credit-card-inputs.complete {
  border: 2px solid green;
}
</style>

 
<script>
import { CardNumber, CardExpiry, CardCvc, createToken } from 'vue-stripe-elements'
import { Stripe } from '@/helper'
import SubscriptionService from '@/services/subscription.js'

export default {
  props: {
    amount: {
      type: String,
    },
    stripePriceId: {
      type: String,
    },
    dismiss: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      complete: false,
      number: false,
      expiry: false,
      cvc: false,
      fee: 0,
      loading: true,
      stripePubkey: process.env.STRIPE_PUBLISHABLE_KEY,
      options: {},
      finalAmount: 0,
    }
  },
  components: { CardNumber, CardExpiry, CardCvc, createToken },
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
  },
  created() {
    this.loading = true
    this.show_error_dialog = false
    this.$store.dispatch('error/showLoadingActivity', true)
    console.log("created....")
    this.fee = Stripe.calculateSubFee(this.amount)
    let finalAmount = parseFloat(this.fee) + parseFloat(this.amount);
    this.finalAmount = finalAmount.toFixed(2)
    console.log("finalAmount====>", finalAmount)
  },
  methods: {
    update() {
      this.complete = this.number && this.expiry && this.cvc
      console.log("stripePriceId==>", this.stripePriceId, this.amount, this.fee)
      // field completed, find field to focus next
      if (this.number) {
        if (!this.expiry) {
          this.$refs.cardExpiry.focus()
        } else if (!this.cvc) {
          this.$refs.cardCvc.focus()
        }
      } else if (this.expiry) {
        if (!this.cvc) {
          this.$refs.cardCvc.focus()
        } else if (!this.number) {
          this.$refs.cardNumber.focus()
        }
      }
      // no focus magic for the CVC field as it gets complete with three
      // numbers, but can also have four
    },
    paymentMethod() {
      createToken().then(data => {
        this.subscribe(this.stripePriceId, data.token)
        this.dismiss()
      })
    },
    subscribe(priceId, tokenResponse) {
      this.$store.dispatch('error/showLoadingActivity', true)
      console.log("priceId===>", this.stripePriceId, this.amount, tokenResponse, tokenResponse.id)
      SubscriptionService.createSubscription({price_id: priceId, token_id: tokenResponse.id, token_response: tokenResponse})
        .then((response) => {
          console.log("==response==", response)

          this.$store.dispatch('error/showLoadingActivity', false)
          this.$router.push({ name: 'AlbumIndex' })
          this.$store.dispatch(
            'error/showSuccessToast', response.body.message
          )
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
  watch: {
    number() { this.update() },
    expiry() { this.update() },
    cvc() { this.update() },
  },
}
</script> 
