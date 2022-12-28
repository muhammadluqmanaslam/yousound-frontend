<template>
  <div class="discover-nav">
    <content-top-header class="black-theme">
      <template slot="topHeader">
        <div class="dflex justify-space-between align-center w-100">


          <ul class="pr-3">
              <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              class="nav-li"
              :class="[{ active: isActiveTab(tab.id) }, `nav-${tab.id}`]"
              >
              <label class="nav-label" @click="onTab(tab.id)">
                <img :src="tab.icon" width="18" class="li-img">
                {{ tab.title }}
              </label>
              </li>

              <v-spacer></v-spacer>

              <!-- <li class="search-li">
                <search-input :senderRoute="$route.name" />
              </li> -->
          </ul>

          <div class="dflex align-center">
            <div class="pos-relative" v-if="searchShow">
              
              <search-input
                :senderRoute="$route.name"
                :isRound="false"
                theme="navbar"
                placeholder="Search song, video, product & people"
                :preIcon="require('@/assets/sidebar_search.svg')"
              />
            </div>

          <div
          class="genre-dialog-selector py-3"
          @mouseenter="hover_on_genre_button = true"
          @mouseleave="hover_on_genre_button = false"
          @click="openGenreSelectorDialog()"
          v-if="filterShow"
        >
        <div class="genre-filter-icon">
          <img src="../assets/setting-filter.svg" width="20">
        </div>
          <div v-show="showGenreTooltip" class="tooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner">
              Set your Genre Filters<br />
              & customize your experience
              <a @click.stop="got_genre_tooltip = true">Got it!</a>
            </div>
          </div>
        </div>


          </div>
        </div>
      </template>
    </content-top-header>

    <v-dialog
    v-if="currentUser"
    v-model="show_genre_selector_dialog"
    :fullscreen="onMobile"
    :content-class="[`my-genre-dialog ma-0 pa-2 ${onMobile ? 'onMobile' : ''}`]"
  >
    <genre-dialog :dismiss="closeGenreSelectorDialog" />
  </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.w-100{
  width: 100%;
}
.gap-10{
  gap: 10px;
}
.genre-filter-icon{
  cursor: pointer;
}
.pos-relative{
  position: relative;

  .search-icon{
    position: absolute;
    left: 22px;
    top: 12px;

  }
}
.input-search{
  background-color: #272727 !important;
  height: 42px!important;
  border-radius: 50px!important;
  width: 350px!important;
  padding-left: 50px!important;
  font-size: 14px!important;
  font-weight: 500!important;
  font-family: 'Inter', sans-serif;
  color: white!important;
  border: none !important;


}  .input-search::placeholder{
  color: rgba(255,255,255,0.5);
}

.genre-dialog-selector {
  position: relative;
  width: 50px;
  display: flex;
  justify-content: flex-end;

  .genre-filter img {
    width: 20px;
    margin-top: 8px;
  }

  .tooltip {
    position: absolute;
    display: block;
    bottom: -63px;
    right: 48px;
    z-index: 9;
    width: 240px;
    padding: 0 0 10px 0;
    background-color: transparent;
    text-transform: initial;
    letter-spacing: -0.1px;
    .tooltip-arrow {
      position: absolute;
      top: -9px;
      right: -20px;
      width: 0;
      height: 0;
      margin: -2px;
      border-style: solid;
      // border-color: rgba(0, 0, 0, 0.2);
      border-color: #1e1e1e;
      border-width: 12px 12px 0;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      transform: rotate(180deg);
    }
    .tooltip-inner {
      position: relative;
      padding: 12px 12px 12px 12px;
      border-radius: 5px;
      // background-color: rgba(0, 0, 0, 0.2);
      background-color: #1e1e1e;
      color: #ffffff;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      width: 285px;
      margin-left: 12px;
      padding-left: 15px;
      a {
        position: absolute;
        top: 15px;
        right: 10px;
        padding: 5px 7px;
        border-radius: 5px;
        background-color: #4389f7;
        color: #ffffff;
      }
    }
  }
}
.toolbar__content ul li label.nav-label img.li-img, .zxyz{
    opacity: 0.5 !important;
    margin-right: 10px;
  }
  .toolbar__content ul li.active label.nav-label img.li-img, .zxyz{
    filter: opacity(1);
    opacity: 1.0 !important;
    margin-right: 10px;
  }
</style>

<script>
import contentTopHeader from '@/components/contentTopHeader'
import SearchInput from '@/components/searchInput'
import genreDialog from '@/components/genre_dialog'
export default {
  props: {
    pageName: String,
    searchShow: Boolean,
    filterShow: String,
  },
  components: {
    contentTopHeader,
    SearchInput,
    genreDialog,
  },
  data() {
    return {
      keyword: "",
      activeTab: '',
      tabs: [
        { id: 'music', title: 'Music', icon: require('../../static/images/nav-music.svg') },
        { id: 'video', title: 'Video', icon: require('../../static/images/nav-video.svg') },
        { id: 'merch', title: 'Shop', icon: require('../../static/images/nav-shop.svg') },
        { id: 'chart', title: 'Charts', icon: require('../../static/images/nav-fire.svg') },
      ],
      show_genre_selector_dialog: false,
      got_genre_tooltip: false,
      hover_on_genre_button: false,
      hover_on_genre_tooltip: false,
    }
  },
  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },

    showGenreTooltip() {
      return (
        !this.got_genre_tooltip &&
        (this.hover_on_genre_button || this.hover_on_genre_tooltip)
      )
    },
  },

  methods: {
    closeGenreSelectorDialog() {
      this.show_genre_selector_dialog = false
      this.setTab(this.activeTab)
    },
    openGenreSelectorDialog() {
      this.show_genre_selector_dialog = true
    },
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    onTab(tab) {
      this.activeTab = tab

      switch (tab) {
        case 'music':
          this.$router.push({name: 'AlbumIndex'})
          break;
        case 'video':
          this.$router.push({name: 'VideoIndex'})
          break;
        case 'merch':
          this.$router.push({name: 'ProductIndex'})
          break;
        case 'chart':
          this.$router.push({name: 'ChartPageIndex'})
          break;
        default:
          break;
      }
    },
  },

  created() {
    // set active tab
    if (this.pageName) {
      this.activeTab = this.pageName
    }
  },
}
</script>
