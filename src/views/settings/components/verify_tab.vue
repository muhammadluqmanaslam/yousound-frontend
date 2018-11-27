<template>
  <div class="main-section" v-if="isPageReady">
    <v-flex xs12 sm12 class="verification-section">
      <div class="profile-section">
        <div class="profile-image" :style="{'background-image': 'url(' + user.avatar.url + ')'}"></div>
        <div class="user-info-section">
          <div class="info-section">
            <label class="user-name">{{ user.display_name }}</label>
            <label class="denied-status">{{ user.request_status }}</label>
          </div>
        </div>
      </div>

      <div class="link-section ma-3 py-2">
        <label>Verified By: </label>
        <span>Morderator Name</span>
        <label class="pl-4">Date Verified: </label>
        <span>Jan 21, 2018</span>
      </div>

      <v-layout row wrap class="about-section mx-3">
        <v-flex xs12 sm12>
          <label>Reasons For Denial</label>
          <p class="link-title">{{ user.denial_reason }}</p>
        </v-flex>
        <v-flex xs12 sm12>
          <label>Denial Description</label>
          <p class="link-title">{{ user.denial_description }}</p>
        </v-flex>
      </v-layout>

      <form v-on:submit.prevent="submit()">
        <v-layout row wrap class="info-section ma-3">
          <v-flex xs12 text-xs-left>
            <v-select v-validate="'required'"
              :items="main_genres"
              v-model="user.genre.id"
              item-value="id"
              item-text="name"
              :disabled="!enabledForm"
              name="main_genre"
              class="main_genre"
              placeholder="What is your main Genre?"></v-select>
          </v-flex>
          <v-flex xs12 text-xs-left>
            <input v-model="user.release_count" v-validate="'required|numeric'"
              type="text" name="release_count" placeholder="How many release do you have" :disabled="!enabledForm">
          </v-flex>
          <v-flex xs12 text-xs-left>
            <input v-model="user.soundcloud_url" v-validate="'required|max:1023'"
              type="text" name="soundcloud_url" placeholder="Soundcloud URL" :disabled="!enabledForm">
          </v-flex>
          <v-flex xs12 text-xs-left>
            <input v-model="user.basecamp_url" v-validate="'required|max:1023'"
              type="text" name="basecamp_url" placeholder="Bandcamp URL" :disabled="!enabledForm">
          </v-flex>
          <v-flex xs12 text-xs-left>
            <input v-model="user.website_url" v-validate="'required|max:1023'"
              type="text" name="website_url" placeholder="Website URL" :disabled="!enabledForm">
          </v-flex>
          <v-flex xs12 text-xs-left>
            <textarea v-model="user.history" v-validate="'required|max:1023'"
              name="history" placeholder="What artists and/or labels have you previously worked with?" :disabled="!enabledForm"></textarea>
          </v-flex>
          <v-flex xs12 text-xs-left v-if="enabledForm">
            <v-btn block round dark type="submit" class="reset-btn">Save and Resend</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./verify_tab.ctrl.js"></script>
