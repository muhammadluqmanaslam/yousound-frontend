<template>
  <div class="mobile-header header-container">
    <div class="header-wrapper dflex justify-space-between align-center width100">
      <div class="_inner-wrapper _left">
        <v-icon
          v-if="showGoBack" 
          color="black" 
          class="go-back mr-3"
          @click="$router.go(-1)"
        >
          arrow_back_ios
        </v-icon>

        <img :src="leftAltIcon" />
      </div>

      <div class="_inner-wrapper _center">
        <img @click="$router.push({name: isAuthenticated ? 'DiscoverIndex' : 'Home'})" :src="centerImg" />
      </div>

      <div class="_inner-wrapper _right">
        <img v-if="showRightAltIcon" :src="rightAltIcon" @click="$router.push(closeCallBack)" />
        <user-tag v-if="!hideUser" :user="currentUser" hideTick showAvatar hideName :width="avatarWidth" :height="avatarHeight" :class="{'ml-3': showRightAltIcon}" />
      </div>
    </div>
    <!-- mobile menu -->
    <!-- <v-btn v-if="showMenu" flat @click="$emit('open-menu')">
      <img :src="menuImgSrc" />
    </v-btn> -->
  </div>
</template>

<script>
import AuthService from '@/services/auth'
import userTag from "@/components/user_tag";

export default {
  props: {
    showGoBack: {
      type: Boolean,
      default: true,
    },
    hideUser: {
      type: Boolean,
      default: false,
    },
    showMenu: {
      type: Boolean,
      default: true,
    },

    leftAltIcon: {
      type: String,
      default: '/static/images/ic_cart.svg',
    },
    showRightAltIcon: Boolean,
    rightAltIcon: {
      type: String,
      default: '/static/images/graph-bar.svg',
    },
    closeCallBack: Object,
    centerImg: String,
    menuImg: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
  components: {
    userTag,
  },

  data() {
    return {
      // logoImgSrc: '',
      avatarWidth: 30,
      avatarHeight: 30,
      // menuImgSrc: '',
    }
  },

  computed: {
    isAuthenticated() {
      return AuthService.isAuthenticated
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    isDarkTheme() {
      return this.theme === 'dark'
    },
  },

  created() {
    // if (this.menuImg === '') {
    //   if (this.isDarkTheme) {
    //     this.menuImgSrc = '/static/images/ic_menu.svg'
    //   } else {
    //     this.menuImgSrc = '/static/images/ic_menu_dark.svg'
    //   }
    // } else {
    //   this.menuImgSrc = this.menuImg
    // }

    // if (this.logoImg === '') {
    //   if (this.isDarkTheme) {
    //     this.logoImgSrc = '/static/images/nav_logo_white.png'
    //   } else {
    //     this.logoImgSrc = '/static/images/nav_logo_primary.png'
    //   }
    // } else {
    //   this.logoImgSrc = this.logoImg
    // }
  },
}
</script>

<style lang="scss" scoped>
.header-container {
  background-color: #ffffff;
  z-index: 6;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 20px;
  box-shadow: none;

  ._inner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .go-back {
      cursor: pointer;
    }

    * {
      cursor: pointer;
    }
  }

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
