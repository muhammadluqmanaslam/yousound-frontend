<template>
  <div class="page auth-page auth-forgot-page">
    <div class="text-xs-center">
      <img class="logo" src="/static/images/nav_logo_primary.png">
      <h4 class="forgot-title">Forgot your password?</h4>
    </div>

    <form v-on:submit.prevent="submit()">
      <v-flex xs12 text-xs-center>
        <!-- <div class="form-group" :class="{'has-error': errors.has('username') }" >
          <input v-model="username" v-validate="'required'" :class="{'input': true, 'text-danger': errors.has('username') }" name="usernameusername" type="text" placeholder="Username or Email">
          <p class="text-danger text-xs-left" v-if="errors.has('username')">{{ errors.first('username') }}</p>
        </div> -->
        <div class="form-group" :class="{'has-error': errors.has('email') }" >
          <input
            class="username"
            v-model="email"
            v-validate="'required|email'"
            :class="{'input': true, 'text-danger': errors.has('email') }"
            name="email"
            type="email"
            placeholder="Email"
          >
          <p class="text-danger text-xs-left" v-if="errors.has('email')">{{ errors.first('email') }}</p>
        </div>
      </v-flex>
      <v-flex xs12 text-xs-center>
        <v-btn block round dark type="submit" class="reset-btn">Email reset instructions</v-btn>
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
      <router-link to="/login">Sign in</router-link>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./forgot_password.ctrl.js"></script>
