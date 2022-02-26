<template>
  <div class="page auth-page auth-forgot-page no-top-nav no-side-space">

    <v-container grid-list-item allChildrenCenter auth-card px-0>
      <v-layout wrap row justify-center>
        <v-flex v-if="!onMobile" xs12 sm6 auth-card-child left-card>
          <div>
            <img width="40%" src="/static/images/nav_logo_primary.png" alt="">

            <div class="mt-4">
              <h3>Forgot password</h3>
            </div>
          </div>

          <v-spacer></v-spacer>

          <div class="forgot-quest">
            <img width="70%" src="/static/images/forgot-quest.svg" alt="">
          </div>
        </v-flex>

        <v-flex xs12 sm6 lg4 auth-card-child allChildrenCenter right-card sign-in-info>

            <v-container fluid pt-0 flex-none>
              <v-layout wrap row justify-center>
                <v-flex xs12 text-xs-center>
                  <div class="text-xs-center">
                    <h2>Forgot password</h2>
                  </div>
                  <form v-on:submit.prevent="submit()">
                    <div class="form-group" :class="{ 'has-error': errors.has('email') }">
                      <input
                        v-model="email"
                        class="username"
                        v-validate="'required|email'"
                        :class="{ input: true, 'text-danger': errors.has('email') }"
                        name="email"
                        type="email"
                        placeholder="Email"
                      />
                      <p class="text-danger text-xs-left" v-if="errors.has('email')">
                        {{ errors.first('email') }}
                      </p>
                    </div>
                    <v-btn block round dark type="submit" class="reset-btn">
                      Reset Password
                    </v-btn>
                    <div class="text-xs-center mt-3 dflex align-center justify-center">
                      <router-link class="terms-text mr-2" to="/login">Back to login</router-link>
                    </div>
                  </form>
                </v-flex>
              </v-layout>
            </v-container>
        </v-flex>
      </v-layout>


    </v-container>

  </div>
</template>

<script type="text/javascript" src="./forgot_password.ctrl.js"></script>
