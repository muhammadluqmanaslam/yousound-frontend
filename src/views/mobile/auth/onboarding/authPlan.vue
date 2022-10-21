<template>
  <div class="auth-plan">
    <h2 class="top_title">Free trial</h2>
    <div class="top_subtitle mt-2">
      Once verified your card will be charged 30 days after the date of
      activation.
    </div>

    <div class="top_subtitle mb-6">Cancel anytime.</div>

    <ul class="_breakdown ml-3">
      <li>Creators must be verified to activate plan</li>
      <li>Purchase of plan does not guarantee verification</li>
      <li>Denied applications are never charged & remain listener accounts</li>
    </ul>


    <div class="plans-container" id="plans">
      <div class="dflex align-center justify-space-between top-note">
        <h1 class="main-title intro-title">Choose plan</h1>
        <div class="_right">* SMS costs $0.01 per text</div>
      </div>
  
        <hr class="light margin-vertical">

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
            <div class="top_item" v-if="(typeof item === 'string')">
              <!-- <v-icon >check</v-icon> -->
              <div class="mr-2">
                <img src="../../../../assets/check-black.svg" width="10">
              </div>
              <div v-html="item">
                {{ item }}
              </div>

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
            class="plan_btn py-4"
            @click.native="openPaymentModal(plan)"
          >
            Get Verified
          </v-btn>
        </div>
      </div>
    </div>
  </div>


    <div class="no-selection" @click="makeListener">
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
import UserService from '@/services/user.js'

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
      return this.plansData.filter((plan) => plan.id != "basic");
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
    closePaymentModal(message) {
      this.initPayment = false;
      this.selectedPlan = {};
      
      if (message = "success") {
        this.handleNextStage()
      }
    },
    openPaymentModal(plan) {
      this.initPayment = true;
      this.selectedPlan = plan;
    },

    makeListener() {
      const params = { id: this.$store.state.app.onboarding.username }
      UserService.changeCreatorRoleIntoListener(params)
      .then((response) => {
        this.$store.dispatch(
          "error/showSuccessToast", [response.bodyText]
        );
      })
      .catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast', ["There was an error on updating user role."]
        )
      })

      this.handleNextStage();
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
  .top_title {
    font-size: 32px;
  }
  .top_subtitle {
    font-size:20px;
    font-weight: 500;

    &.mb-6{
      margin-bottom: 25px
    }
  }

  ul{
    font-size: 16px;
    margin-bottom: 60px;
  }


  .no-selection {
    margin-top: 35px;
    text-decoration: underline;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    text-align: center;
    margin-bottom: 50px;
  }


  .plans-container {
    margin-top: 35px;
    padding-bottom: 75px;


    .top-note {
      font-weight: 400;
      ._right {
        font-size: 14px;
      }
    }
    .margin-vertical{
      margin-top: 20px;
      margin-bottom: 35px;
    }

    .main-title{
      font-size: 44px;
    }

    .plans {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 25px;


      .top_title {
        font-size: 28px;
      }
      .top_subtitle {
        font-size: 18px;
      }

      .plan {
        border-radius: 30px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        padding: 20px 0 28px;
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .plan_title{
          font-size: 28px;
        }

        &_0 {
          
          background: rgba(251, 228, 151, 0.6);
          border: 1px solid rgba(251, 228, 151, 0.6);

        }
        &_1 {
          background: #F7EEEA;
          border: 1px solid #F7EEEA;
        }
      /*  &_2 {
          background: rgba(230, 217, 251, 0.8);
          border: 1px solid rgba(230, 217, 251, 0.8);
       // }*/
        ._bullet{
          margin-right: 5px;
          margin-left: 23px;
        }

        &_title {
          font-size: 28px;
          margin: 10px 0 5px;
          padding: 0 30px;
        }

        &_lists {
          overflow: visible;
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
          margin: 20px 0 0px;

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
  }
}
</style>
