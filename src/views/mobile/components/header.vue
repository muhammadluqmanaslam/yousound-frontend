<template>
  <div class="header-container">
    <template v-if="isDarkTheme">
      <img class="logo" src="/static/images/nav_logo_primary.png">
      <v-btn
        v-if="showMenu"
        flat
        @click="$emit('open-menu')"
      >
        <img src="/static/images/ic_menu_dark.svg">
      </v-btn>
    </template>
    <template v-else>
      <img class="logo" src="/static/images/nav_logo_white.png">
      <v-btn
        v-if="showMenu"
        flat
        @click="$emit('open-menu')"
      >
        <img src="/static/images/ic_menu.svg">
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'light'
    },

    showMenu: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    isDarkTheme () {
      return this.theme !== 'light'
    }
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
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

@media (min-width: 600px) {
  .header-container img {
    height: 28px;
  }
}

@media (min-width: 800px) {
  .header-container img {
    height: 32px;
  }
}
</style>
