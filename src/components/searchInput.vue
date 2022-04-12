<template>
  <div class="search-input" :class="{isOnMobile}">
    <transition name="slide-fade">
        <div class="global-search-box">
        <img v-if="!isOnMobile" class="icon" src="/static/images/search.svg" width="18" />
        <input
            v-model="keyword"
            class="search-field"
            :class="{'isOnMobile-input': isOnMobile}"
            type="search"
            id="search"
            :placeholder="!isOnMobile ? 'Search artist, song or keyword' : 'Search'"
            @keyup.enter="goToSearch()"
        />
        </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    senderRoute: {
      type: String,
    },
    isOnMobile: Boolean,
  },
  data() {
    return {
      keyword: '',
    }
  },
  methods: {
    goToSearch() {
      const keyword = this.keyword
      const senderRoute = this.senderRoute

      this.$router.push({ name: 'Search', query: { q: keyword }, params: {senderRoute} })
    },
  },
  created() {
    this.keyword = this.$route.query.q
  },
}
</script>
