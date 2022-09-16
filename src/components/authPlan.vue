<template>
  <div class="auth-plan">
    <h2 class="top_title">Free trial</h2>
    <div class="top_subtitle mb-2">
      Once verified your card will be charged 30 days after the date of
      activation.
    </div>

    <div class="top_subtitle mb-3">Cancel anytime.</div>

    <ul class="_breakdown mb-3 ml-3">
      <li>Creators must be verified to activate plan</li>
      <li>Purchase of plan does not guarantee verification</li>
      <li>Denied applications are never charged & remain listener accounts</li>
    </ul>

    <div class="plans">
      <div
        v-for="(plan, index) in plans"
        :key="index"
        class="plan"
        :class="[`plan_${index}`]"
      >
        <h2 class="plan_title">{{ plan.title }}</h2>

        <div class="plan_lists">
          <div v-for="(item, i) in plan.list" :key="i" class="plan_list">
            <div class="top_item">
              <v-icon>check</v-icon>
              <div v-if="typeof item === 'string'" v-html="item">
                {{ item }}
              </div>

              <div v-else>
                <div
                  v-for="(innerItem, i) in item"
                  :key="i"
                  class="innerItem dflex"
                >
                  <span class="_bullet">&bull;</span>
                  <span v-html="innerItem">{{ innerItem }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pricing">
          <span class="currency">$</span>
          <span class="cost">{{ plan.price }}</span>
          <span class="per">/month</span>
        </div>

        <div class="plan_btn_wrapper">
          <v-btn
            depressed
            block
            round
            dark
            class="plan_btn"
            @click.native="openPaymentModal(plan)"
          >
            Start free 30 day trial
          </v-btn>
        </div>
      </div>
    </div>

    <div class="no-selection" @click="handleNextStage">
      No thanks, make me a listener
    </div>

    <v-dialog v-model="initPayment" content-class="payment-dialog">
      <payment-card :item="selectedPlan" :totalPayable="totalPayable" :closePayment="closePaymentModal" />
    </v-dialog>
  </div>
</template>

<script>
import PaymentCard from "@/components/paymentCard";
import { mapActions, mapState } from "vuex";
import { Stripe } from "@/helper";

export default {
  components: {
    PaymentCard,
  },
  data() {
    return {
      initPayment: false,
      selectedPlan: {},
    };
  },
  computed: {
    ...mapState({
      plansData: (state) => state.app.plansData,
      current: (state) => state.app.onboarding.current,
    }),
    plans() {
      return this.plansData;
    },
    totalPayable() {
      const fee = parseFloat(this.selectedPlan.price);
      const subFee = Stripe.calculateSubFee(this.selectedPlan.price);

      let total = parseFloat(subFee) + parseFloat(fee);
      total = parseFloat(total.toFixed(2));

      return total
    },
  },
  methods: {
    ...mapActions({
      gotoNextStage: "app/nextOnboardingStage",
    }),
    closePaymentModal() {
      this.initPayment = false;
      this.selectedPlan = {};
    },
    openPaymentModal(plan) {
      this.initPayment = true;
      this.selectedPlan = plan;
    },
    handleNextStage() {
      this.gotoNextStage(this.current + 1);
    },
  },
  mounted() {
    this.selectedPlan = this.plans[0];
  },
};
</script>

<style lang="scss" scoped>
.auth-plan {
  padding: 20px 30px;

  .plans {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top_title {
      font-size: 32px;
    }
    .top_subtitle {
      font-size: 18px;
    }

    .plan {
      border-radius: 30px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      width: 45%;
      padding: 20px 0 33px;

      &_0 {
        background: rgba(211, 221, 230, 0.15);
      }
      &_1 {
        background: rgba(223, 228, 212, 0.15);
      }

      &_title {
        font-size: 32px;
        margin: 20px 0;
        padding: 0 30px;
      }

      &_lists {
        height: 153px;
        overflow: auto;
        padding: 7px 30px 0;
        margin-right: 10px;

        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px transparent;
          -webkit-box-shadow: inset 0 0 6px transparent;
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #d9d9d9;
          -webkit-box-shadow: inset 0 0 6px #d9d9d9;
        }
      }

      &_list {
        line-height: 2;

        .top_item {
          display: flex;
          align-content: flex-start;
          .icon {
            display: block;
            color: #000000;
            margin-right: 10px;
            margin-top: 5px;
            font-size: 13px;
          }
        }
      }

      .pricing {
        letter-spacing: -0.5px;
        padding: 0 30px;
        margin: 20px 0;

        .cost {
          font-size: 32px;
          font-weight: bold;
        }
        .per {
          font-size: 12px;
          color: #000000;
          opacity: 0.68;
        }
      }

      .plan_btn {
        &_wrapper {
          padding: 0 30px;
        }
      }
    }
  }

  .no-selection {
    margin-top: 35px;
    text-decoration: underline;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
