<template>
  <div class="page no-top-nav no-side-space subscribe-landing">
    <div class="banner">
      <v-container class="banner-container">
        <div class="banner-content">
          <h1 class="_title">Join the world’s creators & music lovers.</h1>
          <h1 class="_subtitle">Start your free 30 day trial</h1>
          <v-btn round class="white">Choose Plan</v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="learnmore-comp">
      <learn-more pageMode setOnMobile hideFooter />
    </v-container>

    <v-container class="plans-container">
      <h1>Choose Plan</h1>

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
              <span v-if="plan.id === 'basic'">Start free 30 day trial</span>
              <span v-else>Get Verified</span>
            </v-btn>
          </div>
        </div>
      </div>
    </v-container>

    <v-container class="faq-container">
      <h1 class="mb-3">FAQ</h1>

      <hr class="light" />

      <div class="faqs">
        <div class="faq">
          <h3>How can I pay for a subscription?</h3>
          <div>You can pay with accepted credit cards.</div>
        </div>

        <div class="faq">
          <h3>How does the 30 day trial work?</h3>
          <div>
            Start a free trial to get full access to all features. Simply add a
            valid credit card, your card will be automatically charged 30 days
            after your trial starts and you will be charged on a monthly basis.
          </div>
        </div>

        <div class="faq">
          <h3>How do I change my subscription?</h3>
          <div>
            Go to <strong>Settings</strong> and tap
            <strong>Subscriptions</strong>, if on desktop, go to
            <strong>Settings > Accounts</strong>, then tap the plan you want &
            confirm. If it’s an upgraded plan you will enter a card to start a
            free trial, if you already have a premium subscription the upgrade
            price difference will be pro-rated and billed on the next cycle.
          </div>
        </div>

        <div class="faq">
          <h3>How do I cancel my subscription?</h3>
          <div>
            Go to <strong>Settings</strong> and tap
            <strong>Subscriptions</strong>, if on desktop, go to
            <strong>Settings > Accounts</strong>, then tap Free and confirm.
            Your account will convert to “Preview Only” on the next payment
            cycle.
          </div>
        </div>

        <div class="faq">
          <h3>Can I listen offline?</h3>
          <div>
            Currently, no, however you can download songs you love & support
            creators directly, they keep 100% of their sales.
          </div>
        </div>

        <div class="faq">
          <h3>How do creators share my subscription?</h3>
          <div>
            50% of your monthly subscription is paid directly to the top 10
            creators you stream the most that month. If you stream 10 creators,
            $5 will be split between 10 creators at $0.50 cents, if you only
            stream one creator the entire month, they will earn the entire $5.
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import LearnMore from "@/views/mobile/auth/learnMore";
import AuthPlan from "@/views/mobile/auth/onboarding/authPlan";
import { mapState } from "vuex";

export default {
  components: { LearnMore, AuthPlan },
  data() {
    return {
      // banner:
    };
  },
  computed: {
    ...mapState({
      plansData: (state) => state.app.plansData,
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
  },
};
</script>

<style lang="scss" scoped>
.subscribe-landing {
  .banner {
    background-image: url("../../assets/subscribe-banner.jpg");
    background-size: cover;
    height: 300px;

    .banner-container {
      height: 100%;
      display: grid;
      align-content: center;
    }
  }

  .banner-content {
    color: #ffffff;
  }

  .learnmore-comp {
    margin-top: 40px;
  }

  .plans-container {
    .top-note {
      font-weight: 300;
      margin-top: 30px;
      margin-bottom: 50px;

      ._right {
        color: #222222;
        opacity: 0.7;
      }
      ._right {
        font-size: 13px;
        opacity: 0.96;
      }
    }

    .plans {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;

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
          background: #93939333;
        }
        &_1 {
          background: #eeecb8;
        }
        &_2 {
          background: #ccd7ed;
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
  }

  .faq-container {
    .faqs {
      .faq {
        margin-bottom: 30px;

        h3 {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
