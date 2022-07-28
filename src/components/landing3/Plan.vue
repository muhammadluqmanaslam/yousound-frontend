<template>
    <v-flex xs12 md4 plan :class="{ active: plan.active }">
      <div class="plan-wrapper">
        <h3 class="mb-3">{{ plan.title }}</h3>
        <div class="items">
          <div
            class="item dflex align-start mb-3"
            v-for="(n, i) in plan.list"
            :key="i"
          >
            <span class="dflex">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.57421 14.8225C8.20317 14.8225 7.85174 14.681 7.62655 14.437L4.57886 11.1464C4.48463 11.0447 4.41584 10.9289 4.37642 10.8056C4.33699 10.6822 4.32771 10.5537 4.3491 10.4274C4.37049 10.3011 4.42213 10.1795 4.50107 10.0695C4.58001 9.95953 4.6847 9.86334 4.80916 9.78645C4.93358 9.70924 5.07541 9.65285 5.22655 9.62051C5.37768 9.58817 5.53514 9.58053 5.6899 9.59801C5.84465 9.61549 5.99367 9.65776 6.12839 9.72239C6.26312 9.78702 6.38092 9.87275 6.47503 9.97465L8.48039 12.1382L13.5223 5.52204C13.6896 5.30359 13.956 5.14826 14.2632 5.09011C14.5703 5.03196 14.8932 5.07575 15.1609 5.21186C15.7179 5.49485 15.8894 6.0943 15.5413 6.55015L9.58414 14.3638C9.48245 14.4978 9.34228 14.6095 9.1758 14.6892C9.00931 14.7689 8.82155 14.8141 8.6288 14.8211C8.61004 14.8225 8.59298 14.8225 8.57421 14.8225Z"
                  fill="black"
                />
                <!-- <path
                  v-else
                  d="M8.57421 14.8225C8.20317 14.8225 7.85174 14.681 7.62655 14.437L4.57886 11.1464C4.48463 11.0447 4.41584 10.9289 4.37642 10.8056C4.33699 10.6822 4.32771 10.5537 4.3491 10.4274C4.37049 10.3011 4.42213 10.1795 4.50107 10.0695C4.58001 9.95953 4.6847 9.86334 4.80916 9.78645C4.93358 9.70924 5.07541 9.65285 5.22655 9.62051C5.37768 9.58817 5.53514 9.58053 5.6899 9.59801C5.84465 9.61549 5.99367 9.65776 6.12839 9.72239C6.26312 9.78702 6.38092 9.87275 6.47503 9.97465L8.48039 12.1382L13.5223 5.52204C13.6896 5.30359 13.956 5.14826 14.2632 5.09011C14.5703 5.03196 14.8932 5.07575 15.1609 5.21186C15.7179 5.49485 15.8894 6.0943 15.5413 6.55015L9.58414 14.3638C9.48245 14.4978 9.34228 14.6095 9.1758 14.6892C9.00931 14.7689 8.82155 14.8141 8.6288 14.8211C8.61004 14.8225 8.59298 14.8225 8.57421 14.8225Z"
                  fill="#fff"
                /> -->
              </svg>
            </span>
            <p class="mb-0" v-html="n">
              {{ n }}
            </p>
          </div>
        </div>

        <v-spacer></v-spacer>
        <h5 class="mb-5 mt-15">${{ plan.price }} <span>/month</span></h5>
        <v-btn class="plan_btn" @click.native="openPaymentDialog(plan.stripePriceId)"> Start free trial </v-btn>
      </div>
      <cardModal
        v-if="showCardModal"
        :amount="plan.price"
        :stripePriceId="plan.stripePriceId"
        :dismiss="closePaymentDialog"
      />
    </v-flex>
</template>

<script>
import cardModal from '@/components/landing3/cardModal.vue'

export default {
  name: "Plan",
  props: {
    plan: Object,
  },
  components: {
    cardModal,
  },
  data() {
    return {
      showCardModal: false,
      priceId: null,
      isPageReady: false,
    }
  },
  methods: {
    openPaymentDialog() {
      this.showCardModal = true
    },
    closePaymentDialog() {
      this.showCardModal = false
    },
  },
};
</script>

<style lang="scss" scoped>
@media (min-width: 960px) {
  .col-md-4 {
    max-width: 30% !important;
  }
}
.plan {
    min-height: 662px;
    box-sizing: border-box;
    padding: 40px 30px 30px 30px;

  &-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 30px 30px 30px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    // background: #f7f7f7;

    .items {
      min-height: 182px;
    }
    .item {
      span {
        transform: translateY(3px);
      }
    }
  }
  h3 {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 29px;
    color: #000000;
    font-family: "Inter", sans-serif !important;
  }
  .plan_btn {
    width: 100%;
    height: 59px;
    box-shadow: none !important;
    text-transform: capitalize;
    box-sizing: border-box;
    border-radius: 100px;
    font-style: normal;
    font-weight: 700 !important;
    font-size: 16px !important;
    line-height: 19px !important;
    color: #ffffff !important;
    letter-spacing: normal;
    // border: 2px solid #0569ff;
    background: #000000 !important;
    border-radius: 8px;
  }
  h5 {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 30px;
    color: #000000;
    font-family: "Inter", sans-serif !important;
    opacity: 0.96;
    span {
      font-size: 16px;
      font-weight: normal;
      line-height: 19px;
      color: #000000;
      opacity: 0.68;
    }
  }
  &.active {
    .plan-wrapper {
      h3,
      .item p,
      h5,
      h5 span {
        // color: #ffffff;
      }
      // background: linear-gradient(
      //   180deg,
      //   #3b2b9d 0%,
      //   rgba(21, 12, 73, 0.85) 0.01%,
      //   rgba(23, 5, 132, 0.927083) 99.99%
      // );
      border: 2px solid #5498FF;

      .plan_btn {
        background: #0569FF !important;
      }
    }
  }
}

@media (max-width: 960px) {
  .plan {
    margin-bottom: 24px;
    padding: 0;

    .items {
      min-height: 248px;
    }
  }
}
</style>
