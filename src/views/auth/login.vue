<template>
  <div class="page auth-page auth-login-page no-top-nav no-side-space">

    <v-container grid-list-item allChildrenCenter auth-card px-0 pb-0>
      <v-layout wrap row auth-card-wrapper align-center justify-center>

        <v-flex xs12 md6 auth-card-child left-card sign-in-info>
          <div v-if="!onMobile">
            <img width="40%" src="/static/images/nav_logo_primary.png" alt="">

            <div class="mt-4 dflex align-center">
              <h3>Login</h3>
              <h3 class="mx-3">or</h3>
              <h3>
                <router-link to="/register">Sign Up</router-link>
              </h3>
            </div>
          </div>

          <div v-else class="text-xs-center create-btn-wrapper">

            <!-- <hr class="mb-5" /> -->
                        
              <!-- <div class="black--text mb-3">
                <b>New here?</b>
              </div> -->

              <v-spacer></v-spacer>
              <v-btn
                round
                depressed
                class="transparent create-btn black--text"
                style="margin: 0 auto"
                :to="onMobile? '/onboarding' : '/register'"
              >
                Sign Up
              </v-btn>
          </div>

          <v-spacer v-if="!onMobile"></v-spacer>
          <div v-if="!onMobile" class="text-xs-center auth-img-wrapper">
            <img width="70%" src="/static/images/new_login_img.svg" alt="">
          </div>
        </v-flex>

        <v-flex xs12 md4 auth-card-child right-card sign-in-info>
          <!-- <div v-if="onMediumScreen" class="text-xs-center auth-img-wrapper">
            <img width="150" src="/static/images/nav_logo_primary.png" alt="">
          </div> -->
          <div class="text-xs-center mt-4">
            <h2>Hello,</h2>
            <h2>welcome back!</h2>
          </div>

            <v-container fluid grid-list-item px-0>
              <login-input />
            </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./login.ctrl.js"></script>
