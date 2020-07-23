<template>
  <div
    :class="{
      'earn-money-sticker': !$store.state.player.isPlaying,
      'earn-money-sticker--play': $store.state.player.isPlaying,
    }"
  >
    <h3>Every user can earn money.</h3>
    <p>Setup your account now!</p>
    <v-btn round color="primary" @click="learnMore()">Learn more</v-btn>
  </div>
</template>

<script type="text/javascript">
export default {
  methods: {
    learnMore() {
      this.$store.dispatch('auth/setFirstVisit', false)
      this.$router.push({
        path: '/settings#bank-details',
      })
    },
  },
}
</script>
