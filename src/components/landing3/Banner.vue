<template>
  <div class="banner">
    <v-layout wrap row>
      <v-flex xs12>
        <div
          class="text-container d-flex justify-center align-center flex-column"
        >
          <h3 class="mb-md-15 mb-8">
            {{ title }}
            <br />
            {{ title2 }}
            <br />
            {{ title3 }}
          </h3>
          <a href="#plans" class="plan_btn"> Choose a plan </a>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Banner",
  props: ["title", "title2", "title3"],
};
</script>

<style lang="scss" scoped>
.banner {
  max-width: 1049px;
  margin: auto;
  width: 100%;
  padding: 180px 0px;
}
.text-container {
  height: 100%;
  h3 {
    font-style: normal;
    font-weight: bold;
    font-size: 72px;
    line-height: 80px;
    letter-spacing: -1px;
    color: #000000;
    text-align: center;
  }
  .plan_btn {
    max-width: 180px;
    width: 100%;
    height: 49px;
    box-shadow: none !important;
    text-transform: capitalize;
    box-sizing: border-box;
    border-radius: 100px;
    font-style: normal;
    font-weight: 700 !important;
    font-size: 20px !important;
    line-height: 22px !important;
    color: #ffffff !important;
    letter-spacing: normal;
    background: #0569ff !important;
    border: 2px solid #0569ff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }
}

@media (max-width: 960px) {
  .text-container {
    h3 {
      font-size: 28px;
      line-height: 36px;
      max-width: 280px;
      text-align: center;
    }
  }

  .banner {
    padding-top: 100px;
    padding-bottom: 0px;
  }
}
</style>
