<template>
  <v-layout row wrap class="page auth-page auth-twitter-page">
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2 transition="slide-x-reverse-transition">
      <div class="page-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4>Additional Information</h4>
        </v-flex>
      </div>
      <div class="page-content" v-if="isPageReady">
        <form v-on:submit.prevent="submit()">
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
</template>

<script type="text/javascript" src="./twitter_callback.ctrl.js"></script>
