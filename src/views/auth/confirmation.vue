<template>
  <v-layout row wrap class="page auth-page social-verify-page">
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2>
      <template v-if="token == 'being'">
        <div class="page-header">
          <v-flex xs12 text-xs-center>
            <img class="logo" src="/static/images/nav_logo_primary.png" />
          </v-flex>
          <v-flex xs12 text-xs-center>
            <h4>Check your email</h4>
          </v-flex>
        </div>
        <div class="page-content">
          <v-flex xs12 text-xs-center>
            <!-- <p>We've sent a confirmation link to your e-mail<br><a>{{ email }}</a></p>
            <p v-if="user_type!=0">Your account is currently being reviewed for verification, please allow up to 5 business days. You will receive an email shortly. You currently have a listener account.</p> -->
            <!-- <hr/> -->
            <v-btn round dark @click.native="sendConfirmEmail()"
              >Resend Confirmation E-mail</v-btn
            >
          </v-flex>
        </div>
      </template>

      <template v-else>
        <div class="page-header">
          <v-flex xs12 text-xs-center>
            <img class="logo" src="/static/images/nav_logo_primary.png" />
          </v-flex>
          <v-flex xs12 text-xs-center>
            <h4>Confirm your account</h4>
          </v-flex>
        </div>
        <div class="page-content">
          <v-flex xs12 text-xs-center>
            <router-link to="/login" class="goto-login" v-if="isPageReady"
              >Go To Login</router-link
            >
          </v-flex>
        </div>
      </template>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./confirmation.ctrl.js"></script>
