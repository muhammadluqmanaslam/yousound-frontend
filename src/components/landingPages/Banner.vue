<template>
  <v-container fluid grid-list-xs px-0 banner>
    <v-layout wrap row align-center>
      <v-flex xs12 md6>
        <div
          class="text-container pt-md-15 justify-center align-md-start align-center flex-column"
        >
          <h3 class="mb-5">{{ title }}</h3>
          <v-btn @click="$router.push({name: 'Login'})" class="discover_btn">Discover </v-btn>
        </div>
      </v-flex>

      <v-flex xs12 md6>
        <div class="img-container d-flex justify-center align-center">
          <img :src="imgSrc" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Banner",
  props: ["title", "imgSrc"],
};
</script>

<style lang="scss" scoped>
.banner {
  max-width: 1200px;
  margin: auto;
  width: 100%;
}
.text-container {
  height: 100%;
  h3 {
    font-style: normal;
    font-weight: bold;
    font-size: 55px;
    line-height: 60px;
    letter-spacing: -1px;
    color: #000000;
    // max-width: 544px;
  }
  .discover_btn {
    max-width: 169px;
    width: 100%;
    height: 49px;
    box-shadow: none !important;
    text-transform: capitalize;
    box-sizing: border-box;
    border-radius: 100px;
    font-style: normal;
    font-weight: 700 !important;
    font-size: 20px !important;
    line-height: 20px !important;
    color: #ffffff !important;
    letter-spacing: normal;
    background: #000000 !important;
    border: 2px solid #000000;
  }
}
.img-container {
  height: 100%;
  img {
    width: 90%;
  }
  transform: translate(30px, 40px);
}

@media (min-width: 767px) {
  .banner {
    margin: auto;
    padding-bottom: 100px;
    padding-top: 50px;
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
  .img-container {
    margin-top: 30px;
    img {
      width: 80%;
    }
    transform: translate(0px);
  }
  .banner {
    padding-top: 100px;
  }
}
</style>
