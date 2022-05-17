<template>
  <div class="landing-home">
    <Header />

    <div class="banner-wrapper">
      <img
        :src="bannerImg"
        class="landing-img"
        alt="artist sitting operating beat machine"
      />
    </div>
    <div class="landing-text">The best place for music lovers.</div>

    <div class="auth-btn">
      <v-btn
        depressed
        round
        dark
        class="auth-signup"
        @click="$router.push({name: 'Register'})"
      >
        Sign Up
      </v-btn>
      <v-btn
        depressed
        round
        class="auth-login transparent"
        @click="$router.push({name: 'Login'})"
      >
        Login
      </v-btn>
    </div>
  </div>
</template>

<script>
import Header from "@/components/landingPages/Header.vue";

export default {
  name: "Landing1",
  components: { Header },
  data() {
    return {
      bannerImg: require(`@/assets/banner.gif`),
    };
  },
};
</script>

<style lang="scss" scoped>
.landing-home {
  // display: flex;

  .banner-wrapper {
    text-align: center;
    margin-top: 40px;
    .landing-img {
      width: 80%;
      margin: 0 auto;
    }
  }

  .landing-text {
    font-size: 28px;
    line-height: 36px;
    letter-spacing: -1px;
    text-align: center;
    margin: 25px auto;
    width: 70%;
    font-weight: 900;
  }

  .auth-btn {
    display: flex;
    flex-direction: column;
    align-items: center;

    .auth-signup {
      margin-bottom: 20%;
    }
  }
}
</style>