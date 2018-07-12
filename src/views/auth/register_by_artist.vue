<template>
  <v-layout row wrap>
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg19 offset-lg1 xl10 offset-xl1 transition="slide-x-reverse-transition">
      <v-dialog v-model="show_genre_selector_dialog" content-class="my-genre-dialog ma-0 pa-2">
        <genre-dialog :dismiss="closeGenreSelectorDialog"></genre-dialog>
      </v-dialog>

      <div class="page auth-page auth-register-header artist">
        <!-- <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex> -->
        <v-flex xs12 text-xs-center>
          <h4>Sign Up as Artist</h4>
        </v-flex>
      </div>
      <div class="page auth-page auth-register-page artist">
        <div class="info-section">
          <div class="info-title">Artists can</div>
          <div class="info-description pt-3">- Upload music</div>
          <div class="info-description">- Sell merch</div>
          <div class="info-description">- Promote albums & merch</div>
          <div class="info-description">- Share revenue with any artist, brand, or label</div>
          <div class="info-description">- Broadcast live audio & video chat</div>
        </div>
        <div class="register-section">
          <form v-on:submit.prevent="openGenreSelectorDialog()">
            <v-flex xs12 text-xs-center>
              <div class="avatar-area mt-0">
                <img class="avatar" src="/static/images/placeholder.png" id="avatar" ref="avatar" />
                <label class="upload-caption">Upload image</label>
                <div class="avatar-upload">
                  <input type="file" name="avatar_file" id="avatar_file" ref="avatar_file" class="avatar-file" accept="image/*" v-validate="'required'" @change="imageChanged($event)">
                  <label for="avatar_file">Choose a file</label>
                </div>
              </div>
            </v-flex>
            <v-flex xs12 text-xs-left pt-3>
              <label class="field-title">Username</label>
              <input class="username" type="text" name="username" placeholder="Username" v-model="user.username" v-validate="'required|max:20'">
            </v-flex>
            <v-flex xs12 text-xs-left>
              <label class="field-title">Artist or Brand Name</label>
              <input class="displayname" type="text" name="display_name" placeholder="Display Name" v-model="user.display_name" v-validate="'required|max:20'">
            </v-flex>
            <v-flex xs12 text-xs-left>
              <label class="field-title">Email</label>
              <input class="email" type="email" name="email" placeholder="Email" v-model="user.email" v-validate="'required|email'">
            </v-flex>
            <v-flex xs12 text-xs-left>
              <label class="field-title">Password</label>
              <input class="password" type="password" name="password" placeholder="Password" v-model="user.password" v-validate="'required|min:6'">
            </v-flex>
            <v-flex xs12 text pa-0 text-xs-left>
              <p class="regular-checkbox">
                <input id="terms" type="checkbox" name="terms" v-model="terms" v-validate="'required'"/>
                <label for="terms">Accept <router-link class="forgot-password" to="#">Terms & Conditions</router-link></label>
              </p>
            </v-flex>
            <v-flex xs12 text-xs-center>
              <v-btn block round dark type="submit" class="create-account-button">Create account</v-btn>
            </v-flex>
          </form>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./register_by_artist.ctrl.js"></script>
