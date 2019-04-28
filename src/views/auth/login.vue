<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2>
      <div class="page auth-page auth-login-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4>Sign in</h4>
        </v-flex>
      </div>

      <div class="page auth-page auth-login-page">
        <form v-on:submit.prevent="submit()">
          <v-flex xs12 text-xs-center>
            <div class="form-group" :class="{'has-error': errors.has('email') }" >
              <input class="email" v-model="user.email" v-validate="'required|email'" :class="{'input': true, 'text-danger': errors.has('email') }" name="email" type="email" placeholder="Email">
              <p class="text-danger text-xs-left" v-if="errors.has('email')">{{ errors.first('email') }}</p>
            </div>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <input class="password" type="password" v-model="user.password" placeholder="Password">
          </v-flex>
          <v-flex xs12 px-2>
            <v-layout row wrap>
              <v-flex sm6 xs12>
                <p class="regular-checkbox">
                  <input type="checkbox" id="checkbox" v-model="remember">
                  <label for="checkbox">Remember me</label>
                </p>
              </v-flex>
              <v-flex sm6 xs12 text-xs-right text-sm-right>
                <router-link to="/forgot">Forgot password?</router-link>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-btn block round dark type="submit" class="login-button">Sign in</v-btn>  
          </v-flex>
        </form>
        <v-flex xs12 text-xs-center>
          <v-layout row class="or-divider">
            <v-flex xs5><hr class="divider"></v-flex>
            <v-flex xs2><p class="or">OR</p></v-flex>
            <v-flex xs5><hr class="divider"></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 text-xs-center>
          <router-link class="create-account" to="/register">Create an account</router-link>
        </v-flex>
      </div>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./login.ctrl.js"></script>
