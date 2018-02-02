<template>
  <v-layout row wrap class="page verify-page">
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="verifying-page" v-if="true">
        <v-flex xs12 class="logo-section">
          <img class="logo" src="/static/images/logo.png">
        </v-flex>
        <v-flex xs12 class="content-section">
          <v-layout row>
            <v-flex xs12 sm4 class="left-section">
              <div class="body-section">
                <h4>Thank you for signing up with YouSound!</h4>
                <p>We’ve built powerful tools that allow you to maximize your reach and generate revenue from your music.</p>
                <p>Before artists can upload any content, we verify each artist to ensure that the tools we offer are used responsibly.   Each artist is verified by individuals that specialize in the genre you list your music under.</p>
                <p>Please complete the questionnaire, and allow 3 days for a response.</p>
              </div>
              <div class="divider-section"></div>
            </v-flex>
            <v-flex xs12 sm8 class="right-section">
              <div class="header-section">
                <h4>Tell us about your music</h4>
              </div>
              <div class="body-section">
                <v-layout row pb-2>
                  <v-flex xs12 sm5 class="input-text-section">
                    <v-select
                      v-model="verifying_request.main_genre"
                      label="What is your main Genre?"
                      single-line
                      bottom
                      hide-details
                    ></v-select>
                    <input type="text" class="form-control" v-model="verifying_request.releases" placeholder="How many releases do you have?">
                    <input type="text" class="form-control" v-model="verifying_request.soundcloud_url" placeholder="Soundcloud URL">
                    <input type="text" class="form-control" v-model="verifying_request.bandcamp_url" placeholder="Bandcamp URL">
                    <input type="text" class="form-control" v-model="verifying_request.website_url" placeholder="Website URL">
                  </v-flex>
                  <v-flex xs12 sm7 class="text-area-section">
                    <textarea v-model="verifying_request.description" class="verifying-description form-control non-resizable" placeholder="What artists and/or labels have you previously worked with?"></textarea>
                  </v-flex>
                </v-layout>
                <v-layout row class="action-section">
                  <v-btn class="submit-btn">Submit Your Application</v-btn>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </div>
<div class="verified-page" v-if="false">
        <v-flex xs12 text-xs-center class="logo-section">
          <img class="logo" src="/static/images/logo.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4 class="verified-title">Your application has been received!</h4>
        </v-flex>
        <v-flex xs12 text-xs-center>
          <label class="verified-text">You are currently registered as a listener.</label>
          <label class="verified-text">While your account is being verified, you can discover new music and follow users.</label>
          <label class="verified-text">If your account is approved, your activity will be transfered to your Artist account.</label>
        </v-flex>
        <v-flex xs12 text-xs-center>
          <v-btn class="awesome-btn">Awesome, show me the music!</v-btn>
        </v-flex>
      </div>
    </v-flex>
    <v-flex xs12>
      <v-footer>
        <a href="#">FAQ</a>
        <a href="#">Blog</a>
        <a href="#">Help</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
        <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
      </v-footer>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./get_verified.ctrl.js"></script>
