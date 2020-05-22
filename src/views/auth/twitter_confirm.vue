<template>
  <div class="page auth-page auth-twitter-confirm-page">
    <v-card mt-5>
      <!-- <div class="card__image"><v-icon>twitter</v-icon></div> -->
      <v-card-media contain src="/static/images/ic_twitter.png" height="50px"></v-card-media>
      <v-card-title class="headline">Connect to Twitter</v-card-title>
      <v-card-text>
        To complete verification, you must login to your Artist, Brand, or Label<br>
        Twitter account once time & verify your identity.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn round dark color="blue" px-4 @click.native="submit()">Login to Twitter</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script type="text/javascript" src="./twitter_confirm.ctrl.js"></script>
