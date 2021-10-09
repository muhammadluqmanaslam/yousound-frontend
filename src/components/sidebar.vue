<template>
<v-navigation-drawer permanent app fixed dark class="sidebar">
    <div class="pa-3">
        <div justify-space-between align-center class=" d-flex mb-3">
            <router-link to="/album" class="sidebar-logo">
                <img src="/static/images/nav_logo_white.png">
            </router-link>

            <span class="icon cursor-me pr-2" @click="searchActive = !searchActive">
                    <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 28 28"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                    <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                    <title>Group 22</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g
                        id="Design"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                    >
                        <g
                        id="searchIcon"
                        transform="translate(-732.000000, -61.000000)"
                        stroke="#FFFFFF"
                        stroke-width="1.5999999"
                        >
                        <g id="Group-29" transform="translate(710.000000, 50.000000)">
                            <g
                            id="Group-22"
                            transform="translate(23.000000, 12.000000)"
                            >
                            <circle
                                id="Oval-2"
                                cx="11.375"
                                cy="11.375"
                                r="11.375"
                            ></circle>
                            <path
                                d="M19.5,19.5 L25.59375,25.59375"
                                id="Line"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            </g>
                        </g>
                        </g>
                    </g>
                    </svg>
            </span>
        </div>

        <transition name="slide-fade">
            <div v-show="searchActive" class="search-box">
                <input
                    class="search-field"
                    type="search"
                    id="search"
                    v-model="keyword"
                    placeholder="Search artist, song or keyword"
                    @keyup.enter="goToSearch()"
                />
            </div>
        </transition>
        <v-list v-for="(parent, i) in tabs" :key="i">
            <h4>
                <h3 v-if="parent.name" class="px-3 subheader">{{ parent.name }}</h3>
            </h4>
            <v-list-tile 
                v-for="(subMenu, ii) in parent.items" 
                :key="ii" 
                :to="subMenu.directPath ? `/${subMenu.path}` : {name: subMenu.path}" 
                active-class="activeTab" class="side-tab"
            >
                <v-list-tile-avatar>
                    <div
                    v-if="subMenu.id === 'you'"
                    class="profile-image"
                    :style="{
                        'background-image': 'url(' + currentUser.avatar.thumb.url + ')',
                    }"
                    ></div>
                    <v-icon v-else color="grey" class="__icon">{{ subMenu.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title class="d-flex justify-space-between align-center">
                    <span>{{ subMenu.title }}</span>

                    <span 
                        v-if="subMenu.id === 'notifications' && badge.message > 0" 
                        class="notifications __n_message"
                    >
                        <span class="__count">{{ badge.message }}</span>
                    </span>
                    <span 
                        v-else-if="subMenu.id === 'sales' && badge.sell > 0" 
                        class="notifications __n_sales"
                    >
                        <span class="__count">{{ badge.sell }}</span>
                    </span>
                    <span 
                        v-else-if="subMenu.id === 'cart' && badge.cart > 0" 
                        class="notifications __n_cart"
                    >
                        <span class="__count">{{ badge.cart }}</span>
                    </span>
                </v-list-tile-title>
            </v-list-tile>
        </v-list>
    </div>

        <transition name="slide-fade">
            <side-audio-player
                ref="audioPlayer"
                v-show="$store.getters['navigator/hasAudioPlayer']"
            ></side-audio-player>
        </transition>
</v-navigation-drawer>

</template>

<script>
import sideAudioPlayer from '@/components/sideAudioPlayer'

export default {
//   name: 'sideBar',
  components: {
    sideAudioPlayer,
  },
  data() {
    return {
      selectedTab: 1,
      keyword: '',
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
              path: this.username,
            },
            {
              title: 'Feed',
              id: 'feed',
              icon: 'home',
              path: 'Feed',
            },
            {
              title: 'Notifications',
              id: 'notifications',
              icon: 'notifications',
              path: 'NotificationIndex',
            },
            {
              title: 'Cart',
              id: 'cart',
              icon: 'shopping_cart',
              path: 'Cart',
            },
            {
              title: 'Sales',
              id: 'sales',
              icon: 'local_shipping',
              path: 'Sell',
            },
            {
              title: 'Upload',
              id: 'upload',
              icon: 'file_upload',
              path: 'UploadIndex',
            },
            {
              title: 'Manage',
              id: 'manage',
              icon: 'video_library',
              path: 'ManageIndex',
            },
          ],
        },
        {
          name: 'Discover',
          items: [
            {
              title: 'Video',
              id: 'video',
              icon: 'live_tv',
              path: 'VideoIndex',
            },
            {
              title: 'Music',
              id: 'music',
              icon: 'library_music',
              path: 'AlbumIndex',
            },
            {
              title: 'Shop',
              id: 'shop',
              icon: 'shopping_bag',
              path: 'ProductIndex',
            },
          ],
        },
      ],
    }
  },
  methods: {
    goToSearch() {
      const keyword = this.keyword
      this.$router.push({ path: '/search', query: { q: keyword } })
    },
  },
  computed: {
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
    //   Set username
    this.tabs.forEach((parent) => parent.items.forEach((item) => {
      if (item.id === 'you') {
        item.path = this.username
        item.title = this.username.toUpperCase()
      }
    }))
  },
}
</script>

<style lang="scss" scoped>
</style>

<style src="../../static/styles/sidebar.scss" lang="scss" scoped>
</style>
