<template>
  <div class="mobile-header header-container">
    <div
      v-if="!isModalComp"
      class="header-wrapper dflex justify-space-between align-center width100"
      :class="{'no-modalComp': !isModalComp}"
    >
      <div class="_inner-wrapper _left">
        <v-icon
          v-if="showGoBack" 
          color="black" 
          class="go-back mr-3"
          @click="goBack()"
        >
          arrow_back_ios
        </v-icon>

        <img
          v-if="isAuthenticated"
          :src="leftAltIcon"
          @click="openSearchModal"
        />
      </div>

      <div class="_inner-wrapper _center">
        <img @click="$router.push({name: isAuthenticated ? 'DiscoverIndex' : 'Home'})" :src="centerImg" />
      </div>

      <div class="_inner-wrapper _right">
        <span
          v-if="showRightAltIcon"
          @click="openMusicPlayer()"
        >
          <img
            v-if="isPlaying"
            src="../../../../static/images/music-wave.gif"
            width="25"
            class="right-alt-icon mt-1"
          />
          <img
            v-if="!isPlaying"
            :src="rightAltIcon" 
            width="30"
            class="right-alt-icon"
          />
        </span>
        <user-tag
          v-if="!hideUser && isAuthenticated && !onProfilePage"
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
      <div class="_inner-wrapper _left">

        <img v-if="showModalCompLeftIcon" :src="leftAltIcon" />
      </div>

      <div class="_inner-wrapper _center ml-0">
        <img @click="$router.push({name: isAuthenticated ? 'DiscoverIndex' : 'Home'})" :src="appLogo" />
      </div>

      <div class="_inner-wrapper _right">
        <img
          src="../../../../static/images/ic_close_dark.svg"
          width="18"
          @click="goBack()"
        />
      </div>
    </div>

    <v-dialog
      v-model="searchModalActive"
      fullscreen
      content-class="search-dialog"
      background-color="red"
      transition="slide-up"
    >
      <search ref="searchRef" @closeSearchModal="closeSearchModal" />
    </v-dialog>
  </div>
</template>

<script>
import userTag from "@/components/user_tag";
import Search from "@/views/mobile/components/search";
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  props: {
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
      default: '/static/images/search.svg',
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
    Search,
  },
  data() {
    return {
      // logoImgSrc: '',
      avatarWidth: 30,
      avatarHeight: 30,
      searchModalActive: !false,
      // menuImgSrc: '',
    }
  },
  watch: {},
  methods: {
    ...mapActions({
      toggleMobilePlayer: "player/toggleMobilePlayer",
    }),
    openSearchModal() {
      this.searchModalActive = true
    },
    closeSearchModal() {
      this.searchModalActive = false
    },
    openMusicPlayer() {
      this.toggleMobilePlayer(true);
    },
    goBack() {
      if (this.$route.name == 'AlbumDetail') {
        const prev = this.albumPrevRoute

        return this.$router.push({name: prev})
      }

      const senderRoute = this.senderRoute
      const referrer = document.referrer
      const prevRoute = referrer.split('://')[1].split('/')[1] || '';

      console.log({referrer, prevRoute, senderRoute});

      switch (senderRoute) {
        case 'video':
        case 'music':
        case 'product':
          return this.$router.push({name: 'DiscoverIndex', params: { activeDiscover: senderRoute}})
        default:
          return this.$router.go(-1)
      }
      
    },
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
    isPlaying() {
      const isPlaying = this.$store.state.player.isPlaying && !this.$store.state.player.isPaused
      
      return isPlaying
    },
    ...mapState({
      albumPrevRoute: state => state.appMobile.albumPrevRoute,
    }),
    appLogo() {
      return '/static/images/nav_logo_primary.png'
    },
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
    senderRoute() {
      return this.$route.meta.senderRoute
    },
    showGoBack() {
      return this.$route.meta.showGoBack
    },
    onProfilePage() {
      return this.$route.name === "UserProfile"
    },
  },

  created() {},
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

  .header-wrapper.no-modalComp {
    position: relative;

    ._left {
      width: 25%;
      justify-content: start;
    }
    ._right {
      width: 25%;
    }
  }

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
      &._left {
        width: 25%;
        justify-content: start;
      }
      &._center { 
        flex-grow: 1;
      }
      &._right {
        width: 25%;
        justify-content: end;
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
