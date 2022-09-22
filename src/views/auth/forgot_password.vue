<template>
  <div
    class="page auth-page auth-forgot-page no-top-nav no-side-space">
    <v-container grid-list-item allChildrenCenter auth-card px-0>
      <v-layout v-if="!resetSuccess" wrap row justify-center>
        <v-flex v-if="!onMobile" xs12 sm6 auth-card-child left-card>
          <div>
            <img width="40%" src="/static/images/nav_logo_primary.png" alt="" />

            <div class="mt-4">
              <h3>Forgot password</h3>
            </div>
          </div>

          <v-spacer></v-spacer>

          <div class="forgot-quest">
            <img width="70%" src="/static/images/forgot-quest.svg" alt="" />
          </div>
        </v-flex>

        <v-flex
          xs12
          sm6
          lg4
          auth-card-child
          allChildrenCenter
          right-card
          sign-in-info
        >
          <v-container fluid pt-0 flex-none>
            <v-layout wrap row justify-center>
              <v-flex xs12 text-xs-center>
                <div class="text-xs-center">
                  <h2>Forgot password</h2>
                </div>
                <forgot-password-input />
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>

      <div v-if="resetSuccess" class="reset-successful-layout">
        <h2>Check your email</h2>

        <v-spacer></v-spacer>

        <div class="_content">
          <img width="40" :src="require('@/assets/send_airplane.svg')" alt="" />
          <p class="_message">
            Instructions to reset your password were sent to
            <strong>{{ this.email }}</strong>
          </p>
        </div>

        <v-spacer></v-spacer>

        <v-btn
          block
          round
          dark
          class="to-login-btn"
          height="40"
          @click="toLogin()"
        >
          Login
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./forgot_password.ctrl.js"></script>
