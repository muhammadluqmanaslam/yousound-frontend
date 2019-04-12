<template>
  <div class="page protect-page" style="padding-top: 0px; min-height: 100%;">
    <v-layout column wrap align-center>
      <v-flex xs12 sm4 pa-3 class="text-xs-center">
        <div class="mt-5"><img class="site-logo" src="/static/images/nav_logo_primary.png"></div>
        <v-divider style="width: 50px; margin: 30px auto 30px auto;"></v-divider>
        <form @submit.prevent="submit()">
          <label class="mb-3">Please enter the code word to continue...</label>
          <input
            type="password"
            class="mt-4 mb-2"
            autocomplete="off"
            placeholder="Code Word"
            name="secret_code"
            v-model="secret_code"
          />
          <v-btn block round dark color="blue" class="reset-btn" type="submit">Go</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </div>
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
      // this.$store.dispatch('navigator/goNextState', { page: 'register', tab: 'protect' })
      this.$store.dispatch('navigator/goNextState', { page: '', tab: '' })
    },

    methods: {
      submit () {
        // console.log(sha256(this.secret_code))
        if (sha256(this.secret_code) === process.env.SECRET_CODE) {
          this.$store.dispatch('auth/setSecretCode', process.env.SECRET_CODE)
          // this.$router.push('/')
          this.$router.go(-1)
        }
      }
    }
  }
</script>
