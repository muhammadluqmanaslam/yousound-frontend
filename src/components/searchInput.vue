<template>
  <div class="search-input" :class="{ isOnMobile }">
    <transition name="slide-fade">
      <div class="global-search-box" :class="[`is_${theme}`, {isRound}]">
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
    theme: {
      type: String,
      default: "light",
    },
    isRound: {
      type: Boolean,
      default: true,
    },
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
