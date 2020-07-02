<template>
  <v-toolbar height="100">
    <v-toolbar-title>
      <img class="logo" src="/static/images/nav_logo_white.png">
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <!-- <router-link to="/register"><b>Sign Up</b></router-link>
      <router-link to="/login" class="ml-3">Log In</router-link> -->
      <a href="#"><b>Launching Soon</b></a>
    </v-toolbar-items>
  </v-toolbar>
</template>

<style lang="scss" scoped>
.toolbar {
  padding: 0 120px;
  &__title {
    img {
      height: 28px;
    }
  }
  &__items {
    align-items: center;
    a {
      color: #ffffff;
      font-size: 18px;
    }
  }
}

:not(.btn):not(.menu):first-child {
  margin-left: 0;
}

:not(.btn):not(.menu):last-child {
  margin-right: 0;
}
</style>
