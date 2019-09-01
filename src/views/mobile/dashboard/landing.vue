<template>
  <div class="mobile-page mobile-dashboard-landing-page">
    <div class="page-header mt-5">
      <img class="site-logo" src="/static/images/nav_logo_primary.png">
    </div>

    <section class="app-overview-section text-xs-center mt-5">
      <h4 class="font-weight-300 mb-3">Download the app</h4>
      <h5>Free streaming & downloading</h5>
      <h5>Shop artists & brands</h5>
      <h5>Share content & earn money</h5>
      <h5>No Ads.</h5>
    </section>

    <v-divider/>

    <v-layout row class="app-download-section text-xs-center py-3">
      <v-flex xs6>
        <img src="/static/images/img_download_app_store.svg">
      </v-flex>
      <v-flex xs6>
        <img src="/static/images/img_download_app_google_play.svg">
      </v-flex>
    </v-layout>

    <v-divider/>

    <v-footer class="my-mobile-footer text-xs-center">
      <div class="ml-0"><a href="#">Terms of Service</a></div>
      <div><a href="#">Privacy</a></div>
      <div><a href="#">About</a></div>
      <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
    </v-footer>
  </div>
</template>
