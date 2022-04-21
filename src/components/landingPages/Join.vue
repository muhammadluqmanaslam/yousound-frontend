<template>
  <section class="join-section">
    <v-container grid-list-xs px-0>
      <v-layout wrap row class="justify-center">
        <v-flex xs12>
          <div class="d-flex justify-center align-center flex-column">
            <p class="text-center mb-5">
              Join the community. <br />
              It’s all for you.
            </p>
            <v-btn v-if="!isAuthenticated" class="signup_btn" to="/login"> Sign In </v-btn>
            <v-btn v-else @click="$router.push({name: 'DiscoverIndex'})" class="signup_btn">Discover </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: "Join",
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },
};
</script>

<style lang="scss" scoped>
.join-section {
  padding-top: 60px;
  padding-bottom: 75px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);

  .signup_btn {
    max-width: 100px;
    width: 100%;
    height: 40px;
    box-shadow: none !important;
    text-transform: capitalize;
    box-sizing: border-box;
    border-radius: 100px;
    font-style: normal;
    font-weight: 700 !important;
    font-size: 16px !important;
    line-height: 22px !important;
    color: #ffffff !important;
    letter-spacing: normal;
    background: #000000 !important;
    border: 2px solid #000000;
  }
  p {
    font-style: normal;
    font-weight: bold;
    font-size: 42px;
    line-height: 50px;
    text-align: center;
    letter-spacing: -1px;
    color: #000000;
  }
}

@media (max-width: 960px) {
  .join-section {
    p {
      font-size: 24px;
      line-height: 30px;
    }
  }
}
</style>
