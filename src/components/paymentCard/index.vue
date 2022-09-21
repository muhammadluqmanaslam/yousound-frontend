<template>
  <div class="payment-modal" :class="{ paymentSuccessful, paymentFailed }">
    <transition v-if="!paymentSuccessful && !paymentFailed" name="slide-left">
      <div class="payment-card">
        <div class="dflex align-center justify-space-between">
          <div class="payment-modal-title">Payment</div>
          <v-icon class="cancel-icon-round" @click="closePayment()"
            >cancel</v-icon
          >
        </div>

        <hr />

        <div class="section-wrapper">
          <div class="card-details-wrapper left-child _child">
            <package-details
              :item="item"
              :itemPrice="itemPrice"
              :itemType="itemType"
            />
          </div>

          <div class="card-details-wrapper right-child _child">
            <card-details hidePayBtn :totalPayable="totalPayable" />

            <!-- <div class="region-details-wrapper">
              <div class="region-title">Country or Region</div>

              <div class="__entries">
                <v-select
                  v-model="country"
                  hide-details
                  :items="countries"
                  item-text="country"
                  item-value="country"
                  class="pt-0"
                  placeholder="Choose Country"
                >
                </v-select>
                <input
                  v-model="zipCode"
                  type="number"
                  placeholder="ZIP"
                  class="zip-code"
                />
              </div>
            </div> -->

            <hr class="my-4" />

            <v-btn block round dark class="pay_btn" @click="handlePayment">
              Pay ${{ itemPrice }} /month
            </v-btn>
            <div class="stripe-credit black--text">
              <span class="mr-1"> Powered By</span>
              <img
                :src="require('@/assets/ic_stripe-black.svg')"
                width="40"
                alt="stripe icon"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition v-if="paymentSuccessful" name="slide-left">
      <div class="payment-success payment-ready">
        <div class="payment-modal-title">Confirmation</div>

        <div class="divider my-2"></div>

        <div class="dflex align-center mb-3">
          <v-icon class="success-icon result-icon">check_circle</v-icon>
          <div class="result-text">
            <div>Thank you</div>
            <div>Your account is pending</div>
          </div>
        </div>

        <div class="post">
          We sent an email confirmation to: <br />
          <strong>{{ userEmail }}</strong>
        </div>

        <div class="divider my-4"></div>

        <package-details
          :item="item"
          :itemPrice="itemPrice"
          :itemType="itemType"
          hideTitle
          altMeta
          noBorder
        />

        <v-btn depressed dark round block class="mt-4"
          >Activate your account</v-btn
        >
      </div>
    </transition>

    <transition v-if="paymentFailed" name="slide-left">
      <div class="payment-success payment-ready">
        <div class="payment-modal-title">Payment Failed</div>

        <div class="divider my-2"></div>

        <div class="dflex align-center mb-3">
          <v-icon class="failed-icon result-icon">check_circle</v-icon>
          <div class="result-text">
            <div>Oops</div>
            <div>Your payment was not successful</div>
          </div>
        </div>

        <v-btn depressed dark round block class="mt-4" @click="closePayment()"
          >Close</v-btn
        >
      </div>
    </transition>
  </div>
</template>

<script>
import cardDetails from "./cardDetails.vue";
import PackageDetails from "./packageDetails.vue";
import { mapActions, mapState } from "vuex";
import { createToken } from "vue-stripe-elements";
import SubscriptionService from '@/services/subscription.js'

export default {
  props: {
    item: {
      required: true,
      type: Object,
    },
    totalPayable: Number,
    closePayment: {
      type: Function,
    },
  },
  data() {
    return {
      country: "",
      zipCode: "",
      paymentSuccessful: false,
      paymentFailed: false,
    };
  },
  components: { cardDetails, PackageDetails },
  computed: {
    ...mapState({
      countries: (state) => state.app.countries,
      userEmail: (state) => state.app.onboarding.email,
    }),
    itemType() {
      const { list } = this.item; // update when real data is available

      if (list) {
        return "plan";
      }
    },
    subtitleAppend() {
      const type = this.itemType;

      switch (type) {
        case "plan":
          return "Subscription";
        default:
          break;
      }
    },
    itemPrice() {
      const type = this.itemType;

      switch (type) {
        case "plan":
          return this.item.price;
        default:
          break;
      }
    },
    stripePriceId() {
      const type = this.itemType;

      switch (type) {
        case "plan":
          return this.item.stripePriceId;
        default:
          break;
      }
    },
  },
  methods: {
    ...mapActions({
      getCountries: "app/getCountries",
    }),

    handlePayment() {
      createToken().then((data) => {
        this.subscribe(this.stripePriceId, data.token);
      });
      // console.log({response});
      // this.subscribe(this.stripePriceId, response.data.token);
    },
    subscribe(priceId, tokenResponse) {
      this.$store.dispatch('error/showLoadingActivity', true)

      console.log(
        "priceId===>",
        this.stripePriceId,
        this.amount,
        tokenResponse,
        tokenResponse.id
      );
      const params = { price_id: priceId, token_response: tokenResponse, token_id: tokenResponse.id }
      SubscriptionService.createSubscription(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ["You have successfully subscribed."])
          this.closePayment("success");
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
  created() {
    this.getCountries();
  },
};
</script>

<style lang="scss" scoped>
.payment-modal {
  position: relative;
  background-color: #ffffff;
  padding: 20px;

  .payment-modal-title {
    font-size: 24px;
    font-weight: bold;
  }
  .payment-card {
    hr {
      height: 1px;
      border: none;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      margin: 15px 0;
    }

    .section-wrapper {
      width: 100%;

      display: flex;
      justify-content: space-between;

      .left-child {
        width: 47%;
      }
      .right-child {
        width: 47%;

        .region-details-wrapper {
          .region-title {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 8px;
            text-transform: capitalize;
          }
          .__entries {
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08),
              0px 1px 1px rgba(0, 0, 0, 0.04);
            border-radius: 8px;
          }

          /deep/ .input-group__input {
            border-radius: 8px 8px 0 0;
          }
          .zip-code {
            width: 100%;
            padding: 10px;
            border-top: 0;
            margin-top: -3px;
            border-radius: 0 0 8px 8px;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            /* Firefox */
            &input[type="number"] {
              -moz-appearance: textfield;
            }
          }
        }

        .pay_btn {
          color: #9b9b9b !important;
        }

        .stripe-credit {
          text-align: center;
          font-weight: bold;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 15px;
        }
      }
    }
  }

  .payment-ready {
    .result-icon {
      font-size: 60px;
      margin-right: 10px;

      &.success-icon {
        color: #3caf47;
      }
      &.failed-icon {
        color: red;
      }
    }
    .result-text {
      font-size: 16px;
      font-weight: bold;
    }

    .divider {
      width: 100%;
      border-bottom: 1px solid #ccb4b400;
    }
  }
}
</style>

<style lang="scss">
.dialog.payment-dialog {
  width: auto;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.9);

  .payment-modal {
    width: 755px;

    &.paymentSuccessful,
    &.paymentFailed {
      width: 398px;
    }
  }
}
.overlay.overlay--active {
  width: auto;
  background-color: rgba(0, 0, 0, 0.9);
}
</style>
