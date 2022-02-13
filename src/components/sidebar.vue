<template>
  <v-navigation-drawer permanent app fixed dark :mini-variant="mini" mobile-break-point :width="sideBarWidth" class="sidebar">
    <!-- <span class="white">{{ isAuthenticated }}</span> -->
    <div class="pa-3 tabs-auth-wrapper">
      <div justify-space-between align-center class="d-flex mb-3">
        <router-link :to="{ name: 'AlbumIndex' }" class="sidebar-logo">
          <img v-if="mini" class="_mini" src="/static/images/nav_logo_white_mini.png" />
          <img v-else src="/static/images/nav_logo_white.png" />
        </router-link>

        <span
          class="icon cursor-pointer pr-2"
          @click="searchActive = !searchActive"
        >
        </span>
      </div>

      <div v-if="!isAuthenticated" class="auth-btn-container">
        <ul class="signed-out-menu">
          <li class="cursor-pointer login" @click="$router.push('/login')">
            <img class="mr-2" src="/static/images/sign-in.svg" width="20" />
            <span v-if="!mini" class="width100">Sign In</span>
          </li>
          <li class="cursor-pointer discover" @click="$router.push({name: 'DiscoverIndex'})">
            <img class="mr-2 invert-color" src="/static/images/search.svg" width="20" />
            <span v-if="!mini">Discover</span>
          </li>
        </ul>
      </div>

      <div v-if="currentUser && currentUser.stream !== null && $store.state.streamPlayer == 'active'" class="live-notice" :class="{'pl-0': mini}" @click="$router.push({name: 'VideoManage'})">
          <b v-if="!mini" class="__text">View live broadcast</b>
          <span class="icon_wrapper" :class="{dflex: mini}">
            <v-icon>circle</v-icon>
            <span class="icon_text">LIVE</span>
          </span>
      </div>

      <!-- isAuthenticated: {{ isAuthenticated }} -->

      <template v-if="isAuthenticated">
        <v-list v-for="(parent, i) in tabs" :key="i" class="py-1 px-0">
          <h4>
            <h3 v-if="parent.name" class="px-3 subheader">{{ parent.name }}</h3>
          </h4>
          <div>
            <v-list-tile
            v-for="(subMenu, ii) in parent.items"
            :key="ii"
            :active-class="subMenu.path ? 'activeTab' : ''"
            class="side-tab"
            :to="subMenu.directPath ? `/${subMenu.path}` : { name: subMenu.path }"
            :class="[$route.name == subMenu.path ? 'activeTab' : '', {'d-none' : subMenu.allowedUser && !subMenu.allowedUser.includes(currentUser.user_type)}]"
          >
            <v-list-tile-avatar>
              <div
                v-if="subMenu.id === 'you'"
                class="profile-image"
                :style="{
                  'background-image': 'url(' + currentUser.avatar.thumb.url + ')',
                }"
              ></div>
              <span v-else>
                <img
                  v-if="subMenu.icon.length > 50" 
                  :src="subMenu.icon"
                  class="icon _icon_img"
                />

                <v-icon v-else class="__icon">
                  {{ subMenu.icon }}
                </v-icon>
              </span>
            </v-list-tile-avatar>
            <v-list-tile-title v-if="!mini" class="d-flex justify-space-between align-center">
              <span v-if="!mini" class="__title">{{ subMenu.title }}</span>

              <span 
                v-if="subMenu.id === 'notifications' && badge.message > 0"
                class="dot_notifications"
                :class="{'mr-0 ml-1': mini}"
              >
                <v-icon size="1">circle</v-icon>
              </span>

              <span 
                v-else-if="subMenu.id === 'sales' && badge.sell > 0"
                class="dot_notifications"
                :class="{'mr-0 ml-1': mini}"
              >
                <v-icon size="1">circle</v-icon>
              </span>

              <span 
                v-else-if="subMenu.id === 'cart' && badge.cart > 0"
                class="dot_notifications"
                :class="{'mr-0 ml-1': mini}"
              >
                <v-icon size="1">circle</v-icon>
              </span>
            </v-list-tile-title>
          </v-list-tile>
          </div>
        </v-list>
      </template>
    </div>

    <v-spacer></v-spacer>

    <transition name="slide-fade">
      <side-audio-player
        ref="audioPlayer"
        :isMini="mini"
        v-show="$store.getters['navigator/hasAudioPlayer']"
      ></side-audio-player>
    </transition>

    <div class="toggle-sidebar">
      <img class="cursor-pointer" :class="{inversed: !mini}" @click.stop="mini = !mini" src="/static/images/slide-right.svg" />
      
    </div>
  </v-navigation-drawer>
</template>


<script>
import sideAudioPlayer from '@/components/sideAudioPlayer'
import shareModal from '@/components/sharemodal'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    sideAudioPlayer,
    shareModal,
  },
  data() {
    return {
      mini: false,
      selectedTab: 1,
      searchActive: false,
      tabs: [
        {
          name: '',
          items: [
            {
              title: 'You',
              id: 'you',
              icon: 'circle',
              directPath: true,
              path: 'dashboard',
            },
            {
              title: 'Feed',
              id: 'feed',
              icon: 'home',
              path: 'Feed',
            },
            {
              title: 'Messages',
              id: 'notifications',
              icon: 'mode_comment',
              path: 'NotificationIndex',
            },
            {
              title: 'Cart',
              id: 'cart',
              icon: 'shopping_cart',
              path: 'Cart',
            },
            {
              title: 'Discover',
              id: 'music',
              icon: 'library_music',
              path: 'DiscoverIndex',
            },
            // {
            //   title: 'Sales',
            //   id: 'sales',
            //   icon: 'local_shipping',
            //   path: 'Sell',
            // },
            // {
            //   title: 'Upload',
            //   id: 'upload',
            //   icon: 'file_upload',
            //   path: 'UploadIndex',
            // },
            // {
            //   title: 'Manage',
            //   id: 'manage',
            //   icon: 'video_library',
            //   path: 'ManageIndex',
            // },
          ],
        },
        // {
        //   name: 'Discover',
        //   items: [
        //     {
        //       title: 'Video',
        //       id: 'video',
        //       icon: 'live_tv',
        //       path: 'VideoIndex',
        //     },
        //     {
        //       title: 'Music',
        //       id: 'music',
        //       icon: 'library_music',
        //       path: 'AlbumIndex',
        //     },
        //     {
        //       title: 'Shop',
        //       id: 'shop',
        //       icon: 'shopping_bag',
        //       path: 'ProductIndex',
        //     },
        //   ],
        // },
      ],
    }
  },
  watch: {
    mini(val) {
      // inform store of Mini's update
      this.$store.dispatch('app/toggleSideBarMini', val)
    },
    onMobile(val) {
      // trigger mini on mobile or screen width reduction
      if (!val) {
        this.mini = false
      } else {
        this.mini = true
      }
      console.log('mini:', this.mini);
    },
    isAuthenticated: {
      immediate: true,
      handler(val) {
        if (!val) {
          // this.tabs = [this.allTabs.find((tab) => tab.name === 'Discover')]
        } else if (val) {
          this.tabs = this.allTabs

          // reset username
          this.setUsername()
        }
      },
    },
  },
  methods: {
    menuAction(subMenu) {
      // redundant
      if (subMenu.id === 'activity') {
        // const status = this.$store.state.app.toggleActivity;

        // this.$store.dispatch('app/toggleActivityPopup', !status)
      } else if (subMenu.directPath) {
        this.$router.push(`/${subMenu.path}`)
      } else {
        this.$router.push({ name: subMenu.path })
      }
    },
    setUsername() {
      // this.tabs.forEach((parent) =>
      //   parent.items.forEach((item) => {
      //     if (item.id === 'you') {
      //       // item.path = this.username
      //       item.title = this.username.toUpperCase()
      //     }
      //   })
      // )
    },
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      allTabs: 'app/tabs',
    }),
    ...mapState({
      sideBarWidth: state => state.app.sideBarWidth,
    }),
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    username() {
      return this.$store.state.auth.user.slug
    },
    badge() {
      return this.$store.state.activity.badge
    },
  },
  mounted() {
    this.setUsername()
    if (this.onMobile) {
      this.mini = true
    }
  },
}
</script>

<style lang="scss" scoped>
</style>

<style src="../../static/styles/sidebar.scss" lang="scss" scoped></style>
