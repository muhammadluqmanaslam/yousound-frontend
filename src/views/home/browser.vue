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

<style lang="scss" scoped>
.page.browser-page {
  text-align: center;
  img {
    height: 40px;
    margin: 150px 0 60px 0;
  }
  h2 {
    font-size: 36px;
  }
  p {
    font-size: 16px;
  }
  ul {
    display: inline-block;
    margin-top: 30px;
    list-style-type: none;
    li {
      display: inline-block;
      margin: 15px;
      a {
        display: inline-block;
        width: 100px;
        height: 100px;
        background-size: contain !important;
        &.chrome {
          background: url('/static/images/img_browser_chrome.png') no-repeat center center;
        }
        &.firefox {
          background: url('/static/images/img_browser_firefox.png') no-repeat center center;
        }
        &.brave {
          background: url('/static/images/img_browser_brave.png') no-repeat center center;
        }
        &.opera {
          background: url('/static/images/img_browser_opera.png') no-repeat center center;
        }
        &.yandex {
          background: url('/static/images/img_browser_yandex.png') no-repeat center center;
        }
      }
    }
    // li + li {
    //   margin-left: 30px;
    // }
  }
}
</style>
