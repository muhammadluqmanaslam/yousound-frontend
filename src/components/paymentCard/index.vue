<template>
  <transition name="slide-left">
    <div class="payment-card">
      <div class="dflex align-center justify-space-between">
        <div class="payment-card-title">Payment</div>
        <v-icon class="cancel-icon-round">cancel</v-icon>
      </div>

      <hr />

      <div class="section-wrapper">
        <div class="card-details-wrapper left-child _child">
          <package-details :item="item" :itemPrice="itemPrice" :itemType="itemType" />
        </div>

        <div class="card-details-wrapper right-child _child">
          <card-details />

          <div class="region-details-wrapper">
            <div class="region-title">Country or Region</div>

            <div class="__entries">
              <v-select
                v-model="country"
                hide-details
                :items="countries"
                item-text="country"
                item-value="country"
                class="pt-0"
              >
              </v-select>
              <input
                v-model="zipCode"
                type="number"
                placeholder="ZIP"
                class="zip-code"
              />
            </div>
          </div>

          <hr class="my-4" />

          <v-btn block round dark class="pay_btn"
            >Pay ${{ itemPrice }} /month</v-btn
          >
          <div class="stripe-credit black--text">
            <span class="mr-1"> Powered By </span>
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
</template>

<script>
import cardDetails from "./cardDetails.vue";
import PackageDetails from "./packageDetails.vue";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    item: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      country: "",
      zipCode: "",
    };
  },
  components: { cardDetails, PackageDetails },
  computed: {
    ...mapState({
      countries: (state) => state.app.countries,
    }),
    itemType() {
      const { list } = this.item; // update when real data is available

      if (list) {
        return "plan";
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
  },
  methods: {
    ...mapActions({
      getCountries: "app/getCountries",
    }),
  },
  created() {
    this.getCountries();
  },
};
</script>

<style lang="scss" scoped>
.payment-card {
  position: relative;
  background-color: #ffffff;
  padding: 20px;

  .payment-card-title {
    font-size: 24px;
    font-weight: bold;
  }

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
</style>
