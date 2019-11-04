<template>
  <div class="menu-container">
    <img class="logo" src="/static/images/nav_logo_white.png">
    <v-btn flat>
      <img src="/static/images/ic_menu.svg">
    </v-btn>
  </div>
</template>

<style lang="scss" scoped>
.menu-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background: transparent;
  box-shadow: none;

  img {
    height: 24px;
  }

  .btn {
    position: absolute !important;
    min-width: auto;
    margin: 0;
    right: 15px;
    &__content {
      padding: 8px;
      &:before {
        background-color: transparent;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
