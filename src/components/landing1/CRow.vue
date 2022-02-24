<template>
  <section :class="{ fullWidth: fullWidth }">
    <v-container fluid grid-list-xs px-0>
      <v-layout wrap row>
        <v-flex
          xs12
          md6
          :order="order1"
          :class="[`order-md-${order1}`, 'order-1']"
        >
          <div
            class="text-container dflex justify-center align-center flex-column"
          >
            <h3 class="mb-5">
              {{ title }} <br />
              {{ title2 }}

              <span v-if="ctaText">
                <br />
                <br />
                <a :href="ctaAction" class="cta_btn">{{ ctaText }}</a>
              </span>
            </h3>
          </div>
        </v-flex>

        <v-flex
          xs12
          md6
          :order="order2"
          :class="[`order-md-${order2}`, 'order-2']"
        >
          <div class="img-container dflex justify-center align-center cover-x-space">
            <img
              :class="{
                fullWidth: fullWidth,
                bigImage: bigImage,
                moneyImage: moneyImage,
              }"
              :src="imgSrc"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "CRow",
  props: [
    "title",
    "title2",
    "ctaAction",
    "ctaText",
    "imgSrc",
    "order2",
    "order1",
    "fullWidth",
    "bigImage",
    "moneyImage",
    "coverxspace",
  ],
};
</script>

<style lang="scss" scoped>
.cta_btn {
  padding: 16px 20px;
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
  background: #5d5fef !important;
}
section {
  max-width: 1000px;
  margin: auto;
  width: 100%;
  margin: 180px auto;
  &.fullWidth {
    max-width: 100% !important;
  }
}
.text-container {
  height: 100%;
  h3 {
    font-style: normal;
    font-weight: bold;
    font-size: 42px;
    line-height: 52px;
    letter-spacing: -0.4px;
    color: #000000;
    // max-width: 544px;
    // text-align: center;
  }
}
.img-container {
  height: 100%;
  &.cover-x-space {
    margin: 0 -16px; 
  }

  img {
    width: 100%;
    &.bigImage {
      width: 145% !important;
    }
  }
}

@media (max-width: 960px) {
  .text-container {
    h3 {
      font-size: 28px;
      line-height: 36px;
      text-align: center;
    }
  }
  section {
    margin: 80px auto;
  }
  .img-container {
    img {
      width: 70%;
      &.fullWidth {
        width: 100% !important;
      }
      &.bigImage {
        width: 65% !important;
      }
      &.moneyImage {
        width: 85% !important;
      }
    }
  }
}
</style>
