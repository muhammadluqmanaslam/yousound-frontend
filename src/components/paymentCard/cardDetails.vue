<template>
  <div class="card-details">
    <div class="card-title">Credit Card</div>

    <div class="card-inputs">
      <!-- Using the same "my-input" class on the -->
      <!-- regular input above and on this container. -->
      <card-number
        class="stripe-element card-number payment-card"
        :class="{ complete }"
        ref="cardNumber"
        :stripe="stripePubkey"
        :options="options"
        @change="number = $event.complete"
      />

      <div class="divider"></div>

      <div class="card-box-bottom">
        <card-expiry
          class="stripe-element card-expiry payment-card"
          :class="{ complete }"
          ref="cardExpiry"
          :stripe="stripePubkey"
          :options="options"
          @change="expiry = $event.complete"
        />
        <card-cvc
          class="stripe-element card-cvc payment-card"
          :class="{ complete }"
          ref="cardCvc"
          :stripe="stripePubkey"
          :options="options"
          @change="cvc = $event.complete"
        />
      </div>
      <div v-if="!hidePayBtn" class="pay-btn-wrapper">
        <v-btn class="btn-cta" @click="paymentMethod()" :disabled="!complete">
          Pay ${{ totalPayable }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CardNumber,
  CardExpiry,
  CardCvc,
  createToken,
} from "vue-stripe-elements";

export default {
  props: {
    hidePayBtn: Boolean,
    totalPayable: Number,
  },
  components: { CardNumber, CardExpiry, CardCvc, createToken },
  data() {
    return {
      complete: false,
      number: false,
      expiry: false,
      cvc: false,
      fee: 0,
      stripePubkey: process.env.STRIPE_PUBLISHABLE_KEY,
      options: {
        showIcon: true,
      },
    };
  },
  methods: {
    paymentMethod() {
      createToken().then((data) => {
        this.subscribe(this.stripePriceId, data.token);
      });
    },
  },
};
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

.card-inputs {
  padding-top: 5px;
  margin-bottom: 10px;

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

</style>
