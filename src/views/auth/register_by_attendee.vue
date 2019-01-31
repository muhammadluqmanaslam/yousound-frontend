<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2 transition="slide-x-reverse-transition" v-if="isPageReady">
      <div class="page auth-page auth-register-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4>Sign Up</h4>
        </v-flex>
      </div>
      <div class="page auth-page auth-register-page">
        <form v-on:submit.prevent="submit()" data-vv-scope="main-form">
          <v-flex xs12 text-xs-center>
            <div class="avatar-area">
              <img class="avatar" src="/static/images/placeholder.png" id="avatar" ref="avatar" />
              <label class="upload-caption">Upload image</label>
              <div class="avatar-upload">
                <input type="file" name="avatar_file" id="avatar_file" ref="avatar_file" class="avatar-file" accept="image/*" v-validate="'required'" @change="imageChanged($event)">
                <label for="avatar_file">Choose a file</label>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <input class="username" type="text" name="username" placeholder="Username" autocomplete="off" v-model="user.username" v-validate="'required|max:20'">
          </v-flex>
          <v-flex xs12 text-xs-center>
            <input class="displayname" type="text" name="display_name" placeholder="Display Name" autocomplete="off" v-model="user.display_name" v-validate="'required|max:20'">
          </v-flex>
          <v-flex xs12 text-xs-center>
            <input class="email" type="email" name="email" placeholder="Email" autocomplete="off" v-model="user.email" disabled>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <input class="password" type="password" name="password" placeholder="Password" autocomplete="off" v-model="user.password" v-validate="'required|min:6'">
          </v-flex>
          <v-flex xs12 text pa-0>
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
    </v-flex>

    <v-dialog v-model="show_genre_selector_dialog" content-class="my-genre-dialog ma-0 pa-2">
      <genre-dialog :dismiss="closeGenreSelectorDialog"></genre-dialog>
    </v-dialog>

    <v-dialog v-model="show_additional_info_dialog" fullscreen content-class="additional-info-dialog">
      <v-layout row wrap class="page auth-page auth-twitter-page">
        <v-flex xs12 sm6 offset-sm3 md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2 transition="slide-x-reverse-transition" v-if="isPageReady">
          <div class="page-header">
            <v-flex xs12 text-xs-center>
              <img class="logo" src="/static/images/nav_logo_primary.png">
            </v-flex>
            <v-flex xs12 text-xs-center>
              <h4>Additional Information</h4>
            </v-flex>
          </div>
          <div class="page-content">
            <form v-on:submit.prevent="submitAdditionalForm()" data-vv-scope="additional-form">
              <v-flex xs12 text-xs-center v-if="user.request_role!='brand'">
                <v-select v-validate="'required'"
                  :items="main_genres"
                  v-model="user.genre_id"
                  item-value="id"
                  item-text="name"
                  name="main_genre"
                  class="main_genre"
                  placeholder="What is your main Genre?"></v-select>
              </v-flex>
              <v-flex xs12 text-xs-center v-if="user.request_role!='brand'">
                <input v-model="user.release_count" v-validate="'required|numeric'"
                  type="text" name="release_count" placeholder="How many release do you have">
              </v-flex>
              <v-flex xs12 text-xs-center v-if="user.request_role!='brand'">
                <input v-model="user.soundcloud_url" v-validate="'required|max:1023|url'"
                  type="text" name="soundcloud_url" placeholder="Soundcloud URL">
              </v-flex>
              <v-flex xs12 text-xs-center v-if="user.request_role!='brand'">
                <input v-model="user.basecamp_url" v-validate="'required|max:1023|url'"
                  type="text" name="basecamp_url" placeholder="Bandcamp URL">
              </v-flex>
              <v-flex xs12 text-xs-center>
                <input v-model="user.website_url" v-validate="'required|max:1023|url'"
                  type="text" name="website_url" placeholder="Website URL">
              </v-flex>
              <v-flex xs12 text-xs-center>
                <textarea v-model="user.history" v-validate="'required|max:1023'"
                  name="history" placeholder="What artists and/or labels have you previously worked with?"></textarea>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn block round dark type="submit" class="reset-btn">Next</v-btn>
              </v-flex>
            </form>
          </div>
        </v-flex>
      </v-layout>
    </v-dialog>
  </v-layout>
</template>

<script type="text/javascript" src="./register_by_attendee.ctrl.js"></script>
