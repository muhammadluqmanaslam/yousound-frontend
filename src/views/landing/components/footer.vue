<template>
  <div class="footer-container">
    <v-layout>
      <div>
        <img class="logo" src="/static/images/nav_logo_white.png" height="20">
      </div>
      <div class="ml-5">
        <div><label>Company</label></div>
        <div><label>Blog</label></div>
        <div><label>Investors</label></div>
        <div><label>Jobs</label></div>
      </div>
      <div class="ml-5">
        <div><label>Quick Links</label></div>
        <div><label>iOS App</label></div>
        <div><label>Support</label></div>
      </div>
      <v-spacer></v-spacer>
      <div>
        <img src="/static/images/img_download_ios.svg" height="48">
      </div>
    </v-layout>

    <v-layout class="mt-5">
      <div><label>Term of use</label></div>
      <div class="ml-4"><label>Privacy</label></div>
      <div class="ml-4"><label>Community Guidelines</label></div>
      <div class="ml-4"><label>Copyright</label></div>
      <v-spacer></v-spacer>
      <div><label>&copy; 2019 YouSound,Inc.</label></div>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  padding: 30px 120px;
  background-color: #000;
  color: #fff;
  font-size: 12px;
  line-height: 24px;
}
</style>
