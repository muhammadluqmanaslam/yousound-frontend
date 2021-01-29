<template>
  <div class="footer-container">
    <div>&copy; 2020 YouSound,Inc.</div>
    <v-spacer></v-spacer>

    <div class="footer">
      <div><router-link to="/terms">Terms of use</router-link></div>
      <div class="ml-4">
        <router-link to="/terms#privacy_policy">Privacy</router-link>
      </div>
      <div class="ml-4">
        <router-link to="/terms#community_guidelines"
          >Community Guidelines</router-link
        >
      </div>
      <div class="ml-4">
        <a href="//support.yousound.com" target="_blank">Support</a>
      </div>
      <div class="ml-4">
        <a
          href="mailto:investors@yousound.com?subject=Investment&body=Hi, please tell us about yourself & your investment history."
          >Investors</a
        >
      </div>
    </div>

    <v-spacer></v-spacer>

    <a href="//apps.apple.com/us/app/id1452078262" target="_blank"
      ><img src="/static/images/img_download_ios.svg" height="36"
    /></a>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 30px;
  background-color: #000;
  color: #fff;
  font-size: 12px;

  .footer {
    display: flex;
    background: transparent;
  }

  img {
    filter: invert(1);
  }

  a {
    color: #fff;
  }
}
</style>
