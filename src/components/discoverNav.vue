<template>
  <div class="discover-nav margin-top-header">
    <content-top-header>
      <template slot="topHeader">
          <ul class="pr-3">
              <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              class="nav-li"
              :class="[{ active: isActiveTab(tab.id) }, `nav-${tab.id}`]"
              >
              <label class="nav-label" @click="onTab(tab.id)">
                <img :src="tab.icon" width="18" class="li-icon">
                {{ tab.title }}
              </label>
              </li>

              <v-spacer></v-spacer>

              <!-- <li class="search-li">
                <search-input :senderRoute="$route.name" />
              </li> -->
          </ul>
      </template>
    </content-top-header>
  </div>
</template>

<script>
import contentTopHeader from '@/components/contentTopHeader'
import SearchInput from '@/components/searchInput'
export default {
  props: {
    pageName: String,
  },
  components: {
    contentTopHeader,
    SearchInput,
  },
  data() {
    return {
      activeTab: '',
      tabs: [
        { id: 'discover', title: 'Trending', icon: require('../../static/images/discover.svg') },
        { id: 'music', title: 'Music', icon: require('../../static/images/music.svg') },
        { id: 'video', title: 'Video', icon: require('../../static/images/video.svg') },
        { id: 'merch', title: 'Shop', icon: require('../../static/images/shop.svg') },
      ],
    }
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    onTab(tab) {
      this.activeTab = tab

      switch (tab) {
        case 'discover':
          this.$router.push({name: 'DiscoverIndex'})
          break;
        case 'music':
          this.$router.push({name: 'AlbumIndex'})
          break;
        case 'video':
          this.$router.push({name: 'VideoIndex'})
          break;
        case 'merch':
          this.$router.push({name: 'ProductIndex'})
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
