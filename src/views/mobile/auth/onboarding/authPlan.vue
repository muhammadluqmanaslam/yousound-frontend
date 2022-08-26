<template>
  <div class="auth-plan">
    <h2 class="top_title">Free trial</h2>
    <div class="top_subtitle mb-2">
      Once verified your card will be charged 30 days after the date of
      activation.
    </div>

    <div class="top_subtitle mb-3">Cancel anytime.</div>

    <ul class="_breakdown mb-3">
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
              <div v-if="typeof item === 'string'" v-html="item">{{ item }}</div>

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

        <h5 class="mb-5 mt-15">${{ plan.price }} <span>/month</span></h5>

        <v-btn
          depressed
          block
          round
          dark
          class="plan_btn"
          @click.native="openPaymentDialog(plan.stripePriceId)"
        >
          Start free 30 day trial
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      plansData: (state) => state.app.plansData,
    }),
    plans() {
      return this.plansData.filter((plan) => plan.id != "basic");
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-plan {
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
      height: 400px;
      width: 45%;
      padding: 10px 0;

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
        height: 120px;
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
    }
  }
}
</style>