<template>
  <v-layout row wrap>
    <v-flex xs12 sm12>
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
            <a @click="submit('artist')">
              <img class="avatar" src="/static/images/artist.png" />
              <div class="pt-2">Aritst</div>
            </a>
          </div>
          <div class="artist-area">
            <a @click="submit('label')">
              <img class="avatar" src="/static/images/listener.png" />
              <div class="pt-2">Label</div>
            </a>
          </div>
          <div class="artist-area">
            <a @click="submit('brand')">
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
  </v-layout>
</template>

<script type="text/javascript" src="./register_as.ctrl.js"></script>
