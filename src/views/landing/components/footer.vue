<template>
  <div class="footer-container">
    <v-layout>
      <!-- <div>
        <img class="logo" src="/static/images/nav_logo_white.png" height="20">
      </div> -->
      <div>
        <div><label>Company</label></div>
        <!-- <div><a href="//yousound.ghost.io" target="_blank">Blog</a></div> -->
        <div>
          <a
            href="mailto:investors@yousound.com?subject=Investment&body=Hi, please tell us about yourself & your investment history."
            >Investors</a
          >
        </div>
        <div>
          <a
            href="//support.yousound.com/en/collections/2401816-careers"
            target="_blank"
            >Careers</a
          >
        </div>
      </div>
      <div class="ml-5">
        <div><label>Quick Links</label></div>
        <div>
          <a href="//apps.apple.com/us/app/id1452078262" target="_blank"
            >iOS App</a
          >
        </div>
        <div><a href="//support.yousound.com" target="_blank">Support</a></div>
      </div>
      <v-spacer></v-spacer>
      <!-- <div class="ml-5">
        <img src="/static/images/img_download_ios.svg" height="48">
      </div> -->
    </v-layout>

    <v-layout class="mt-5">
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
        <router-link to="/terms#copyright_policy">Copyright</router-link>
      </div>
      <v-spacer></v-spacer>
      <div>&copy; 2020 YouSound,Inc.</div>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
div {
  z-index: 9999;
}
.footer-container {
  padding: 30px 120px;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  label {
    color: #666;
  }
  a {
    color: #fff;
  }
}
a {
  color: #fff;
}
</style>
