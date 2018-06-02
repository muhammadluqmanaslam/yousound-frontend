<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="page auth-page auth-login-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4>Sign Up as</h4>
        </v-flex>
      </div>
      <div class="page auth-page auth-register-as-page">
        <v-flex xs12 text-xs-center pa-0>
          <div class="artist-area">
            <router-link class="create-account" to="/register/listener">
              <img class="avatar" src="/static/images/listener.png" />
              <div class="pt-2">Listener</div>
            </router-link>
          </div>
          <div class="artist-area">
            <a @click="openTwitterConfirmDialog('artist')">
              <img class="avatar" src="/static/images/artist.png" />
              <div class="pt-2">Aritst</div>
            </a>
          </div>
          <div class="artist-area">
            <a @click="openTwitterConfirmDialog('label')">
              <img class="avatar" src="/static/images/listener.png" />
              <div class="pt-2">Label</div>
            </a>
          </div>
          <div class="artist-area">
            <a @click="openTwitterConfirmDialog('brand')">
              <img class="avatar" src="/static/images/listener.png" />
              <div class="pt-2">Brand</div>
            </a>
          </div>
        </v-flex>
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

    <v-dialog v-model="show_twitter_confirm_dialog" fullscreen content-class="twitter-confirm-dialog">
      <v-card mt-5>
        <!-- <div class="card__image"><v-icon>twitter</v-icon></div> -->
        <v-card-media contain src="/static/images/ic_twitter.png" height="50px"></v-card-media>
        <v-card-title class="headline">Connect to Twitter</v-card-title>
        <v-card-text>To complete verification, you must login to your Artist, Brand, or Label<br>
        Twitter account once time & verify your identity.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn round dark color="blue" px-4 @click.native="submit()">Login to Twitter</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script type="text/javascript" src="./register_as.ctrl.js"></script>
