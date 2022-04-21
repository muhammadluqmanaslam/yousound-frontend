<template>
  <div class="mobile-header header-container">
    <div v-if="!isModalComp" class="header-wrapper dflex justify-space-between align-center width100">
      <div class="_inner-wrapper _left">
        <v-icon
          v-if="showGoBack" 
          color="black" 
          class="go-back mr-3"
          @click="$router.go(-1)"
        >
          arrow_back_ios
        </v-icon>

        <img v-if="isAuthenticated" :src="leftAltIcon" />
      </div>

      <div class="_inner-wrapper _center">
        <img @click="$router.push({name: isAuthenticated ? 'DiscoverIndex' : 'Home'})" :src="centerImg" />
      </div>

      <div class="_inner-wrapper _right">
        <img
          v-if="showRightAltIcon"
          :src="rightAltIcon" 
          width="18"
          class="right-alt-icon"
          @click="$router.push(closeCallBack)"
        />
        <user-tag
          v-if="!hideUser && isAuthenticated"
          :user="currentUser"
          hideTick
          showAvatar
          hideName
          :width="avatarWidth"
          :height="avatarHeight"
          :class="{'ml-3': showRightAltIcon}"
        />
      </div>
    </div>

    <div
      v-else
      class="header-wrapper dflex justify-space-between align-center width100"
      :class="{isModalComp}"
    >
      <img v-if="showModalCompLeftIcon" :src="leftAltIcon" />

      <div class="_inner-wrapper _center ml-0">
        <img @click="$router.push({name: isAuthenticated ? 'DiscoverIndex' : 'Home'})" :src="appLogo" />
      </div>

      <div class="_inner-wrapper _right">
        <img
          src="../../../../static/images/ic_close_dark.svg"
          width="18"
          @click="$router.go(-1)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import userTag from "@/components/user_tag";
import { mapGetters } from 'vuex'

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
    appLogo() {
      return '/static/images/nav_logo_primary.png'
    },
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
    currentUser() {
      return this.$store.state.auth.user
    },
    isDarkTheme() {
      return this.theme === 'dark'
    },
    isModalComp() {
      return this.$route.meta.isModalComp
    },
    showModalCompLeftIcon() {
      return this.$route.meta.showModalCompLeftIcon
    },
    showRightAltIcon() {
      return this.$route.meta.showRightAltIcon
    },
  },

  created() {
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

    &._center {
      // margin-left: -35px;
    }

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

  .isModalComp {
    ._inner-wrapper {
      &._center { 
        flex-grow: 1;
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
