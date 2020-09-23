<template>
  <div class="mobile-auth-confirm-page">
    <mobile-header theme="light" :show-menu="false" />

    <template v-if="!loading">
      <div class="section" v-if="confirmed">
        <h3>Your email is confirmed!</h3>
        <a href="ys://login">Open App</a>
      </div>
      <div class="section" v-else>
        <h3>Check your email</h3>
        <!-- <a @click.stop="sendConfirmEmail()"> Resend Confirmation E-mail </a> -->
      </div>
    </template>
  </div>
</template>

<script>
import AuthService from '@/services/auth'
import MobileHeader from '@/views/mobile/components/header'

export default {
  components: {
    MobileHeader,
  },

  data() {
    return {
      loading: true,
      token: null,
      confirmed: false,
    }
  },

  created() {
    this.token = this.$route.params.token

    const params = {
      confirmation_token: this.token,
    }

    AuthService.activeAccount(params)
      .then(() => {
        this.confirmed = true
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
  },

  methods: {
    sendConfirmEmail() {
      const params = {
        email: this.email,
      }
      AuthService.sendConfirmEmail(params)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Resent a confirmation email',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.mobile-auth-confirm-page {
  .section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h3 {
      font-size: 20px;
    }

    a {
      display: block;
      margin-top: 30px;
      padding: 10px 30px;
      border-radius: 40px;
      color: #ffffff;
      background-color: #000;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .header-container {
    position: absolute;
  }
}
</style>
