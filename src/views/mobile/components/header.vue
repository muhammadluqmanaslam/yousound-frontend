<template>
  <div class="header-container">
    <template v-if="isDarkTheme">
      <img :src="logoImgSrc">
      <v-btn
        v-if="showMenu"
        flat
        @click="$emit('open-menu')"
      >
        <img :src="menuImgSrc">
      </v-btn>
    </template>
    <template v-else>
      <img :src="logoImgSrc">
      <v-btn
        v-if="showMenu"
        flat
        @click="$emit('open-menu')"
      >
        <img :src="menuImgSrc">
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'dark'
    },

    showMenu: {
      type: Boolean,
      default: true
    },

    logoImg: {
      type: String,
      default: ''
    },

    menuImg: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      logoImgSrc: '',
      menuImgSrc: ''
    }
  },

  computed: {
    isDarkTheme () {
      return this.theme === 'dark'
    }
  },

  created () {
    if (this.menuImg === '') {
      if (this.isDarkTheme) {
        this.menuImgSrc = '/static/images/ic_menu.svg'
      } else {
        this.menuImgSrc = '/static/images/ic_menu_dark.svg'
      }
    } else {
      this.menuImgSrc = this.menuImg
    }

    if (this.logoImg === '') {
      if (this.isDarkTheme) {
        this.logoImgSrc = '/static/images/nav_logo_white.png'
      } else {
        this.logoImgSrc = '/static/images/nav_logo_primary.png'
      }
    } else {
      this.logoImgSrc = this.logoImg
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
    display: none;
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
