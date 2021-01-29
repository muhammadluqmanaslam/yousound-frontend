<template>
  <v-layout class="header-container">
    <!-- <div>
      <img class="logo" src="/static/images/nav_logo_white.png" />
    </div> -->

    <v-spacer></v-spacer>

    <router-link to="/login">Log In</router-link>
    <router-link to="/register" class="ml-3">Sign Up</router-link>
  </v-layout>
</template>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  padding: 30px 30px;
  background: transparent;

  img {
    height: 28px;
  }

  a {
    color: #ffffff;
    font-size: 18px;
  }
}
</style>
