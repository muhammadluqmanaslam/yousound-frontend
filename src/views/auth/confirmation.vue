<template>
<div class="page auth-page no-top-nav social-verify-page">
  <v-container fluid px-0>
    <v-layout wrap row justify-center flex-column>
      <v-flex xs12 sm5 md8>
        <template v-if="token == 'being'">
          <div class="page-header">
            <v-flex xs12 text-xs-center>
              <img class="logo" src="/static/images/nav_logo_primary.png" />
              <br />
              <img class="mt-4 confirm_mail" src="/static/images/confirm_mail.svg" />
            </v-flex>
            <v-flex xs12 text-xs-center>
              <h4>Check your email & confirm your account</h4>
            </v-flex>
          </div>
          <div class="page-content">
            <v-flex xs12 text-xs-center>
              <p>
                If you don't see the email in your main inbox<br />check your
                other folders like 'promotions'
              </p>
              <!-- <p v-if="user_type!=0">Your account is currently being reviewed for verification, please allow up to 5 business days. You will receive an email shortly. You currently have a listener account.</p> -->

              <div v-if="user_type!=0" class="__artistBrand-note">
                <h5>After you confirm your artist / brand account:</h5>
                <ul class="allChildrenCenter flex-column">
                  <li>
                      Please allow at least 72 hours for staff to verify your account 
                  </li>
                  <li>
                      If your account hasn’t been verified within 72 hours send us a DM on Instagram to <a href="https://instagram.com/yousoundapp" target="_blank">@yousoundapp</a> from the social media URL you signed up with
                  </li>
                </ul>
              </div>
              <v-btn 
                round 
                dark
                depressed
                class="px-3 mt-4"
                @click.native="sendConfirmEmail()"
              >
                Resend email
              </v-btn>
            </v-flex>
          </div>
        </template>

        <template v-else>
          <div class="page-header">
            <v-flex xs12 text-xs-center>
              <img class="logo" src="/static/images/nav_logo_primary.png" />
              <br />
              <img class="my-4 confirm_mail" src="/static/images/confirm_mail.svg" />
            </v-flex>
            <v-flex xs12 text-xs-center>
              <h4>Confirm your account</h4>
            </v-flex>
          </div>
          <div class="page-content">
            <v-flex xs12 text-xs-center>
              <v-btn
                v-if="isPageReady"
                round 
                dark
                depressed
                class="px-3 mt-4"
                to="/login"
              >
                Goto Login
              </v-btn>
            </v-flex>
          </div>
        </template>
      </v-flex>

      <v-flex xs12 sm8>
        <div class="__footer">
          <hr />

          <div class="barcode-wrapper">
            <img class="app_store" width="200" src="/static/images/store.png" />
            <img class="qr-code" width="90" src="/static/images/ios-app-link-qr.svg" />
          </div>

          <div class="barcode__description">
            Android users can use the <br /> mobile web version of YouSound
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script type="text/javascript" src="./confirmation.ctrl.js"></script>
