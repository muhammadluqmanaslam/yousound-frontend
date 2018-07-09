<template>
  <v-layout row wrap class="page auth-page auth-reset-page">
    <v-flex xs12 sm6 offset-sm3  md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2>
      <div class="page-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4 class="forgot-title">Reset your password</h4>
        </v-flex>
      </div>
      <div class="page-content">
        <form v-on:submit.prevent="submit()">
          <v-flex xs12 text-xs-center>
            <div class="form-group" :class="{'has-error': errors.has('password') }" >
              <input v-model="password" v-validate="'required|min:6'" :class="{'input': true, 'text-danger': errors.has('password') }" name="password" type="password" placeholder="Password">
              <p class="text-danger text-xs-left" v-if="errors.has('password')">{{ errors.first('password') }}</p>
            </div>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <div class="form-group" :class="{'has-error': errors.has('confirm_password') }" >
              <input v-model="confirm_password" v-validate="'required|confirmed:password'" :class="{'input': true, 'text-danger': errors.has('confirm_password') }" name="confirm_password" type="password" placeholder="Confirm Password">
              <p class="text-danger text-xs-left" v-if="errors.has('confirm_password')">{{ errors.first('confirm_password') }}</p>
            </div>
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-btn block round dark type="submit" class="reset-btn">Reset</v-btn>  
          </v-flex>
        </form>
        <v-flex xs12 text-xs-center>
          <v-layout row class="or-divider">
            <v-flex xs5><hr class="divider"></v-flex><v-flex xs2><p class="or">OR</p></v-flex><v-flex xs5><hr class="divider"></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 text-xs-center>
          <a class="sign-in" href="/login">Sign in</a>
        </v-flex>
      </div>
    </v-flex>

    <app-footer></app-footer>
  </v-layout>
</template>

<script type="text/javascript" src="./reset_password.ctrl.js"></script>
