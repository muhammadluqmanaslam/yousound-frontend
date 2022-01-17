<template>
  <div class="page auth-page auth-login-page no-top-nav no-side-space">

    <v-container grid-list-item allChildrenCenter auth-card px-0>
      <v-layout wrap row auth-card-wrapper align-center>
        <v-flex xs12 sm6 auth-card-child left-card sign-in-info>
          <div v-if="!onMobile">
            <h1>Hello,</h1>
            <h1 class="mb-4">welcome back!</h1>

            <h3>New to YouSound?</h3>
            <div class="create-btn-wrapper">
              <v-btn
                round
                depressed
                class="ml-0 create-btn black--text"
                to="/register"
              >
                Create Account
              </v-btn>
            </div>
          </div>
          <div v-else class="text-xs-center create-btn-wrapper">
            <h3>Are you new around here?</h3>
              <v-btn
                round
                depressed
                class="create-btn black--text"
                style="margin: 0 auto"
                to="/register"
              >
                Create Account
              </v-btn>
          </div>

          <v-spacer></v-spacer>
          <div class="text-xs-center auth-img-wrapper">
            <img width="70%" src="/static/images/auth-img-1.svg" alt="">
          </div>
        </v-flex>

        <v-flex xs12 sm6 auth-card-child right-card sign-in-info>
          <h4 v-if="!onMobile" class="text-xs-center">Sign in</h4>
          <div v-else class="text-xs-center mt-4">
            <h2>Hello,</h2>
            <h2>welcome back!</h2>
          </div>

          <form v-on:submit.prevent="submit()" autocomplete="off">
            <v-container fluid grid-list-item px-0>
              <v-layout wrap justify-center>
                <v-flex xs12 sm8 text-xs-center>
                  <div class="form-group" :class="{ 'has-error': errors.has('email') }">
                    <input
                      class="email"
                      v-model="user.email"
                      v-validate="'required|email'"
                      :class="{ input: true, 'text-danger': errors.has('email') }"
                      name="email"
                      type="email"
                      placeholder="Email"
                      autocomplete="off"
                    />
                    <p class="text-danger text-xs-left" v-if="errors.has('email')">
                      {{ errors.first('email') }}
                    </p>
                  </div>
                </v-flex>
                <v-flex xs12 sm8 text-xs-center>
                  <input
                    class="password"
                    type="password"
                    v-model="user.password"
                    placeholder="Password"
                    autocomplete="new-password"
                  />
                </v-flex>
                <v-flex v-if="!onMobile" xs12 sm8 px-2 dflex align-center justify-space-between block-n-reverse-column-m>
                    <p class="regular-checkbox">
                      <input type="checkbox" id="checkbox" v-model="remember" />
                      <label for="checkbox">Remember me</label>
                    </p>
                    <router-link class="forgot-password-text" to="/forgot">Forgot password?</router-link>
                </v-flex>
                <v-flex xs12 sm8 text-xs-center mt-3>
                  <v-btn block round dark type="submit" class="login-button"
                    >Login</v-btn
                  >
                    <router-link v-if="onMobile" class="forgot-password-text" to="/forgot">Forgot password?</router-link>
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./login.ctrl.js"></script>
