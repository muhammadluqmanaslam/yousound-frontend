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
  data() {
    return {
      keyword: '',
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

<style>

</style>
