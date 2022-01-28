<template>
  <div class="search-input">
    <transition name="slide-fade">
        <div class="global-search-box">
        <v-icon>search</v-icon>
        <input
            v-model="keyword"
            class="search-field"
            type="search"
            id="search"
            placeholder="Search artist, song or keyword"
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

<style>

</style>
