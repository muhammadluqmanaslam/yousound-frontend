<template>
<v-navigation-drawer permanent app fixed dark class="sidebar">
    <div class="pa-3">
        <div justify-space-between align-center class=" d-flex mb-3">
            <router-link to="/album">
                <img src="/static/images/nav_logo_white.png" width="60%">
            </router-link>

            <span class="icon cursor-me" @click="searchActive = !searchActive">
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
                <h3 class="px-3">{{ parent.name }}</h3>
            </h4>
            <v-list-tile 
                v-for="(subMenu, ii) in parent.items" 
                :key="ii" 
                :to="`#${subMenu.id}`" 
                active-class="activeTab" class="side-tab"
            >
                <v-list-tile-avatar>
                    <v-icon small color="grey">{{ subMenu.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title class="">
                    {{ subMenu.title }}
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
          name: 'For You',
          items: [
            {
              title: 'You',
              id: 'recommended',
              icon: 'circle',
              path: 'AlbumIndex',
            },
            {
              title: 'Activity',
              id: 'activity',
              icon: 'notifications',
              path: 'ActivityIndex',
            },
            {
              title: 'Home',
              id: 'home',
              icon: 'home',
              path: 'Feed',
            },
            {
              title: 'Messages',
              id: 'messages',
              icon: 'email',
              path: 'Messages',
            },
            {
              title: 'Cart',
              id: 'cart',
              icon: 'shopping_cart',
              path: 'Cart',
            },
            {
              title: 'Orders',
              id: 'orders',
              icon: 'local_shipping',
              path: 'Sell',
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
      items: [
        {
          action: 'local_activity',
          title: 'Attractions',
          path: '/',
          items: [],
        },
        {
          action: 'restaurant',
          title: 'Breakfast',
          path: '/breakfast',
          items: [],
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
}
</script>

<style lang="scss" scoped>
.list__tile {
    height: 40px !important;
}
.avatar .icon {
    justify-content: flex-start !important;
}
#search {
    color: grey;
    border: 1px solid grey;
    width: 100%;
    border-radius: 6px;
    margin-bottom: 3px;
    padding: 5px;
    transition: opacity .5s;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
