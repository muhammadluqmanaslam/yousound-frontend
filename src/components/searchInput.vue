<template>
  <div class="search-input" :class="{ isOnMobile }">
    <transition name="slide-fade">
      <div class="global-search-box">
        <img
          v-if="!isOnMobile"
          class="icon"
          src="/static/images/search.svg"
          width="18"
        />
        <input
          v-model="keyword"
          class="search-field"
          :class="{ 'isOnMobile-input': isOnMobile }"
          type="search"
          id="search"
          :placeholder="placeholder"
          @keyup.enter="goToSearch()"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    searchTab: {
      type: String,
    },
    senderRoute: {
      type: String,
    },
    placeholder: {
      type: String,
      default: "Search artist, song or keyword",
    },
    isOnMobile: Boolean,
  },
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    goToSearch() {
      const keyword = this.keyword;
      const senderRoute = this.senderRoute;
      const searchTab = this.searchTab;

      this.$router.push({
        name: "Search",
        query: { q: keyword },
        params: { senderRoute, searchTab },
      });
    },
  },
  created() {
    this.keyword = this.$route.query.q;
  },
};
</script>
