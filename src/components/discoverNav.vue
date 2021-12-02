<template>
  <div class="discover-nav">
    <content-top-header>
      <template slot="topHeader">
          <ul class="pr-3">
              <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
              >
              <label @click="onTab(tab.id)">{{
                  tab.title
              }}</label>
              </li>
          </ul>
      </template>
    </content-top-header>
  </div>
</template>

<script>
import contentTopHeader from '@/components/contentTopHeader'
export default {
  props: {
    pageName: String,
  },
  components: {
    contentTopHeader,
  },
  data() {
    return {
      activeTab: '',
      tabs: [
        { id: 'discover', title: 'Discover' },
        { id: 'music', title: 'Music' },
        { id: 'video', title: 'Video' },
        { id: 'merch', title: 'Shop' },
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

<style>

</style>
