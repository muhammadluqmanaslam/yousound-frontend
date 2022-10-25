<template>
  <div class="page no-top-nav no-side-space subscribe-landing">
    <div class="banner">
      <v-container class="banner-container">
        <div class="banner-content">
          <h1 class="_title">Join the world’s creators & music lovers.</h1>
          <p class="_subtitle">Start your free 30 day trial</p>
          <a href="#plans">
            <v-btn round class="white">Choose Plan</v-btn>
          </a>
        </div>
      </v-container>
    </div>

    <v-container class="learnmore-comp">
      <learn-more pageMode setOnMobile hideFooter />
    </v-container>

    <v-container class="plans-container pb-5 mb-5" id="plans">
      <h1 class="main-title intro-title">Choose Plan</h1>

      <hr class="light">

      <div class="dflex align-center justify-space-between top-note">
        <div class="_left">Cancel anytime.</div>
        <div class="_right">* SMS costs $0.01 per text</div>
      </div>

      <div class="plans">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="plan"
          :class="[`plan_${index}`, `plan_${plan.id}`]"
        >
        <div>
          <h2 class="plan_title">{{ plan.title }}</h2>

          <div class="plan_lists">
            <div v-for="(item, i) in plan.list" :key="i" class="plan_list">
              <div class="top_item" v-if="(typeof item === 'string')">
                <v-icon >check</v-icon>
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
        </div>

          <div class="pricing-absolute">
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
              @click.native="verifyUserType(plan)"
            >
              <span>{{ plansDescription(plan.id) }}</span>
            </v-btn>
          </div>
        </div>
        </div>
      </div>
    </v-container>

    <v-container class="faq-container">
      <h1 class="main-title mb-3">FAQ</h1>

      <hr class="light mb-5" />

      <div class="faqs">
        <div class="faq">
          <h3>How can I pay for a subscription?</h3>
          <div>You can pay with accepted credit cards.</div>
        </div>

        <div class="faq">
          <h3>How does the 30 day trial work?</h3>
          <div>
            Start a free trial to get full access to all features. Simply add a
            valid credit card, your card will be <br> automatically charged 30 days
            after your trial starts and you will be charged on a monthly basis.
          </div>
        </div>

        <div class="faq">
          <h3>How do I change my subscription?</h3>
          <div>
            Go to <strong>Settings</strong> and tap
            <strong>Subscriptions</strong>, if on desktop, go to
            <strong>Settings > Accounts</strong>, then tap the plan you<br/> want &
            confirm. If it’s an upgraded plan you will enter a card to start a
            free trial, if you already have a<br/> premium subscription the upgrade
            price difference will be pro-rated and billed on the next cycle.
          </div>
        </div>

        <div class="faq">
          <h3>How do I cancel my subscription?</h3>
          <div>
            Go to <strong>Settings</strong> and tap
            <strong>Subscriptions</strong>, if on desktop, go to
            <strong>Settings > Accounts</strong>, then tap Free and<br/> confirm.
            Your account will convert to “Preview Only” on the next payment
            cycle.
          </div>
        </div>

        <div class="faq">
          <h3>Can I listen offline?</h3>
          <div>
            Currently, no, however you can download songs you love & support
            creators directly,<br/> they keep 100% of their sales.
          </div>
        </div>

        <div class="faq">
          <h3>How do creators share my subscription?</h3>
          <div>
            50% of your monthly subscription is paid directly to the top 10
            creators you stream the most that month. If you<br/> stream 10 creators,
            $5 will be split between 10 creators at $0.50 cents, if you only
            stream one creator the entire<br/>  month, they will earn the entire $5.
          </div>
        </div>
      </div>
    </v-container>
    <v-dialog v-model="initPayment" content-class="plans-dialog">
      <payment-card :item="selectedPlan" :totalPayable="totalPayable" :closePayment="closePaymentModal" />
    </v-dialog>

    <v-dialog v-model="plansUpgradeModal" v-if="currentUser !== null && currentUser.plan !== null">
      <v-card>
        <v-card-title class="headline"
          >Plan Changes</v-card-title
        >
        <v-card-text v-if="plansName[currentUser.plan] == 'Listener'"
          >
          <p>Your current plan is <b> {{ plansName[currentUser.plan]}} </b> and you are trying to <b>{{ planChangeText }}. </b> </p>
          <p>You will remain listener until admin approve your account. Once you verified, you will be charged according to subscription of current plan and new chosen plan.
            Are you sure you want to continue?
          </p>
        </v-card-text>
        <v-card-text v-else>
          <p>Your current plan is <b> {{ plansName[currentUser.plan]}} </b> and you are trying to <b>{{ planChangeText }}. </b> </p>
          <p>This will have an immediate effect and you will be charged according to subscription of current plan and new chosen plan.
            Are you sure you want to continue?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="subscriptionChange(planChangeText)"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="hidePlanChangeModal()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LearnMore from "@/views/mobile/auth/learnMore";
import AuthPlan from "@/views/mobile/auth/onboarding/authPlan";
import { mapState } from "vuex";
import PaymentCard from "@/components/paymentCard";
import { Stripe } from "@/helper";
import SubscriptionService from '@/services/subscription'

export default {
  components: { LearnMore, AuthPlan, PaymentCard },
  data() {
    return {
      // banner:
      initPayment: false,
      selectedPlan: {},
      plansUpgradeModal: false,
      plansList: {'basic': 1, plus: '2', pro: '3'},
      plansName: {'basic': 'Listener', plus: 'Creator', pro: 'Advance'},
      planChangeText: null,
      renderComponent: true,
    };
  },
  computed: {
    ...mapState({
      plansData: (state) => state.app.plansDataSub,
      current: (state) => state.app.onboarding.current,
    }),
    plans() {
      const plans = this.plansData.map((plan) => {
        if (plan.id == "basic") {
          plan.title = "Everyone";
        }
        return plan;
      });

      return plans;
    },

    currentUser() {
      return this.$store.state.auth.user;
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
    openPaymentModal(plan) {
      this.initPayment = true;
      this.selectedPlan = plan;
    },

    verifyUserType(plan) {
      this.selectedPlan = plan
      if (this.currentUser == null) {
        this.$router.push({path: '/signup'})
      }
      else if (this.currentUser && this.currentUser.stripe_customer_id == null) {
        this.openPaymentModal(plan)
      }
      else {
        this.planChangeText = this.plansCategory(this.currentUser.plan, this.plansList[plan.id])
        if (!(this.planChangeText === 'Current Plan' || this.planChangeText === null)) {
          this.plansUpgradeModal = true
        }
      }
    },

    closePaymentModal() {
      this.initPayment = false;
      this.selectedPlan = {};
    },

    plansDescription(plan) {
      if (this.currentUser == null || this.currentUser.plan === null) {
        if (plan == 'basic') {
          return 'Start free 30 day trial'
        } else {
          return 'Get Verified'
        }
      } else {
        return this.plansCategory(this.currentUser.plan, this.plansList[plan])
      }
    },

    plansCategory(userPlan, planCategory) {
      if(this.plansList[userPlan] == planCategory) {
        return 'Current Plan'
      } else if (planCategory <= this.plansList[userPlan]) {
        return 'Downgrade Plan'
      } else {
        return 'Upgrade Plan'
      }
    },

    subscriptionChange(plan) {
      let params = { selectedPlan: this.selectedPlan.id }
      SubscriptionService.subscriptionChange(params)
        .then((response) => {
          this.hidePlanChangeModal()
          this.$store.dispatch('error/showSuccessToast', [response.body.success_response])
          window.location.href = '/subscribe'
        })
        .catch((e) => {
          this.$store.dispatch('error/showErrorToast', [e.body])
        })
    },

    hidePlanChangeModal() {
      this.plansUpgradeModal = false
      this.planChangeText = null
    },
  },

  mounted() {
    this.selectedPlan = this.plans[0];
  },
};
</script>

<style lang="scss" scoped>

.container{
  max-width: 950px;
}


@media screen and (min-width: 1500){
  .plans {
    gap: 50px;
  }
}

.main-title{
  font-size: 44px;
  font-weight: bold;
  letter-spacing: -2px;
}
.subscribe-landing {

  br{
    display: none;
  }
  .banner {
    background-image: url("../../assets/subscribe-banner.jpg");
    background-size: cover;
    background-position: left;
    padding: 120px 0 90px;
    .banner-container {
      height: 100%;
      display: grid;
      align-content: center;
    }

    .btn{
      height: auto;
      margin-bottom: 0px;
      margin-top: 30px;
      margin-left: 0px;
      padding: 11px 15px;
      font-size: 18px;
      font-weight: bold;
      box-shadow: none;
      border: none;
    }
  }

  .banner-content {
    color: #ffffff;

    ._title{
      font-size: 50px;
      line-height: 60px;
      font-weight: bold;
      letter-spacing: -2px;
    }
    ._subtitle{
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 0;
    }
  }

  .learnmore-comp {
    margin-top: 40px;
  }

  .plans-container {
    .top-note {
      font-weight: 300;
      margin-top: 30px;
      margin-bottom: 50px;

      ._left {
        color: #222222;
        font-size: 20px;
        font-weight: 500;
        opacity: 0.7;
      }
      ._right {
        font-size: 12px;
      }
    }

    .plans {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 25px;

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
        padding: 20px 0 28px;
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        &_0 {
          background: #fbfbfb;
          border: 1px solid rgba(147,147,147,0.2);

        }
        &_1 {
          background: linear-gradient(166.67deg, #FFFDCA 3.03%, #FFFDC5 98.02%);
          border: 1px solid #eeecb8;
        }
        &_2 {
          background: linear-gradient(163.95deg, #EAF5FF 2.46%, #DDE7FF 98.79%);
          border: 1px solid #ccd7ed;
        }
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
  }

  .faq-container {
    .faqs {

      br{
        display: block;
      }
      .faq {
        margin-bottom: 30px;

        h3 {
          margin-bottom: 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 1250px) and (min-width: 960px) {
  .container{
    max-width: 900px;

    .intro-title{
      font-size: 36px;
    }
  
    .banner-content{
      ._title{
        font-size: 42px;
        line-height: 50px;
      }
  
      ._subtitle{
        font-size: 20px;
      }

    }
    .banner .btn{
      font-size: 16px;
      padding: 7.5px 10px;
    }
  }




    .plans {
      gap: 25px !important; 
    }
  

  
}
</style>
