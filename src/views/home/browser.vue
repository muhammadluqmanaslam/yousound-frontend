<template>
  <div class="page browser-page">
    <h2>Update Your Browser</h2>
    <p>We only support the latest browsers, and there’s plently to choose from.</p>
    <ul>
      <li><div class="chrome"></div></li>
      <li><div class="firefox"></div></li>
      <li><div class="brave"></div></li>
      <li><div class="opera"></div></li>
      <li><div class="yandex"></div></li>
    </ul>
  </div>
</template>

<script type="text/javascript">
  export default {
    data () {
      return {
      }
    },

    created () {
      if (this.$store) {
        this.$store.dispatch('navigator/goNextState', { page: '', tab: '' })
      }
    }
  }
</script>
