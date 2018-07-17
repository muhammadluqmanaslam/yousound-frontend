<template>
  <v-layout row wrap class="page protect-page">
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3 lg8 offset-lg2 xl8 offset-xl2 transition="slide-x-reverse-transition">
      <div class="page-header">
        <v-flex xs12 text-xs-center>
          <img class="logo" src="/static/images/nav_logo_primary.png">
        </v-flex>
        <v-flex xs12 text-xs-center>
          <h4 class="forgot-title">Please enter the code word to continue...</h4>
        </v-flex>
      </div>
      <div class="page-content">
        <form @submit.prevent="submit()">
          <v-flex xs12 text-xs-left>
            <label class="field-title"></label>
            <input type="password" name="secret_code" autocomplete="off" placeholder="Code Word" v-model="secret_code">
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-btn block round dark type="submit" class="reset-btn">Go</v-btn>  
          </v-flex>
        </form>
      </div>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript">
  import { sha256 } from 'js-sha256'

  export default {
    data () {
      return {
        secret_code: ''
      }
    },

    created () {
      this.$store.dispatch('navigator/goNextState', { page: 'register', tab: 'protect' })
    },

    methods: {
      submit () {
        // console.log(sha256(this.secret_code))
        if (sha256(this.secret_code) === process.env.SECRET_CODE) {
          this.$store.dispatch('auth/setSecretCode', process.env.SECRET_CODE)
          this.$router.push('/')
        }
      }
    }
  }
</script>
