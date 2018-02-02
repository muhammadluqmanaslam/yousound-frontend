<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3  md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2>
      <div class="page auth-page auth-login-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
      </div>
      <v-flex xs12 text-xs-center>
        <v-progress-circular indeterminate v-bind:size="50" class="primary--text part-loading-activity" v-if="isLoading"></v-progress-circular>
      </v-flex>
      <div class="page auth-page twitter-verify-page text-xs-center" v-if="!isLoading">
      	<h4>Your account is being verified.</h4>
      </div>
    </v-flex>
    <v-footer>
      <a href="#">FAQ</a>
      <a href="#">Blog</a>
      <a href="#">Help</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
      <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
    </v-footer>
  </v-layout>
</template>

<script type="text/javascript" src="./social_verify.ctrl.js"></script>
