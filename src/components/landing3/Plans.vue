lan<template>
  <section class="plans-section" id="plans">
    <div class="plans-inner">
      <h3 class="title">Choose a plan</h3>
      <v-container fluid px-0>
        <v-layout wrap row justify-space-between mt-4>
          <plan v-for="(plan, n) in plansData" :key="n" :plan="plan" class=""></plan>
        </v-layout>
      </v-container>
    </div>
  </section>
</template>

<script>
import Plan from "./Plan.vue";
export default {
  components: { Plan },
  name: "Plans",
  data() {
    return {
      plansData: [
        {
          title: "Basic",
          list: ["1 account", "Ad-free music & video", "Analytics"],
          active: false,
          price: "9.99",
        },
        {
          title: "Plus",
          list: [
            "1 account",
            "Ad-free music & video",

            `Make money sharing content. Charge up to <strong>$5K</strong> per repost`,
            `Artists & Brands can sell physical products + keep 100% sales`,
            `Advanced analytics`,
          ],
          active: true,
          price: "29.99",
        },
        {
          title: "Pro",
          list: [
            "1 account",
            "Ad-free music & video",

            `Make money sharing content. Charge up to <strong>$100K</strong> per repost `,
            `Artists & Brands can sell physical products + keep 100% sales`,
            `Advanced analytics`,
          ],
          active: false,
          price: "99.99",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.plans-section {
  max-width: 100% !important;
  width: 100% !important;
  .plans-inner {
    max-width: 1250px;
    width: 100%;
    margin: auto;
  }
  border-bottom: 1px solid rgba(0, 0, 0, 0.19);
  padding: 130px 0px !important;
  margin: auto !important;
  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 42px !important;
    line-height: 51px;
    text-align: center;
    color: #000000;
    opacity: 0.96;
    font-family: "Inter", sans-serif !important;
  }
}
@media (min-width: 960px) {
  .col-md-4 {
    max-width: 30% !important;
  }
}

@media (max-width: 960px) {
  .plans-section {
    padding-top: 20px !important;
    .plans-inner {
      padding: 0px 30px !important;
    }
    .title {
      font-size: 28px !important;
      line-height: 40px;
    }
  }
}
</style>
