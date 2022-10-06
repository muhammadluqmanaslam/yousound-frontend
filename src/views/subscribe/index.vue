<template>
  <div class="page no-top-nav no-side-space subscribe-landing">
    <div class="banner">
      <v-container class="content-container">
        <div class="banner-content">
          <h1 class="_title">Join the world’s creators & music lovers.</h1>
          <h1 class="_subtitle">Start your free 30 day trial</h1>
          <v-btn round class="white">Choose Plan</v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="learnmore-comp">
      <learn-more pageMode setOnMobile />
    </v-container>
  </div>
</template>

<script>
import LearnMore from "@/views/mobile/auth/learnMore"

export default {
  components: { LearnMore },
  data() {
    return {
      // banner:
    }
  }
}
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
}
</style>