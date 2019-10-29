<template>
  <div class="page auth-page twitter-verify-page text-xs-center">
    <div class="text-xs-center">
      <img class="logo" src="/static/images/nav_logo_primary.png">
    </div>

    <v-flex xs12 text-xs-center v-if="isLoading">
      <v-progress-circular indeterminate v-bind:size="50" class="primary--text part-loading-activity"></v-progress-circular>
    </v-flex>

    <h4 v-else>Your account is being verified.</h4>
  </div>
</template>

<script type="text/javascript" src="./social_verify.ctrl.js"></script>
