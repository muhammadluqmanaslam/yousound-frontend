<template>
  <div class="page browser-page">
    <img class="logo" src="/static/images/nav_logo_primary.png">
    <h2>Update Your Browser</h2>
    <p>We only support the latest browsers, and there’s plently to choose from.</p>
    <ul>
      <li><a class="chrome" href="https://www.google.com/chrome/"></a></li>
      <li><a class="firefox" href="https://www.mozilla.org/en-US/firefox/"></a></li>
      <li><a class="brave" href="https://brave.com/download/"></a></li>
      <li><a class="opera" href="https://www.opera.com/"></a></li>
      <li><a class="yandex" href="https://browser.yandex.com/"></a></li>
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
