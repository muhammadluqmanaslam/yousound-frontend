<template>
  <div class="mobile-auth-confirm-page">
    <mobile-header theme="light" :show-menu="false" />

    <template v-if="!loading">
      <div class="section" v-if="confirmed">
        <div class="section__content">
          <h3>Success!</h3>
          <p class="text-xs-center">
            Your account has been activated.<br />
            Download the app and login.
          </p>
          <a href="//apps.apple.com/us/app/id1452078262" target="_blank"
            ><img src="/static/images/img_download_app_store.svg"
          /></a>
        </div>
        <div class="section__footer">
          <p>Have the iOS app already?</p>
          <a href="ys://login">Open App</a>
        </div>
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

    &__content {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        height: 60px;
      }
    }

    &__footer {
      height: 120px;
      flex: 0 0 auto;
      text-align: center;

      p {
        margin-bottom: 0;
        font-size: 14px;
      }

      a {
        color: #000;
        line-height: 40px;
        font-size: 16px;
        font-weight: 700;
      }
    }

    h3 {
      font-size: 24px;
    }
  }

  .header-container {
    position: absolute;
  }
}
</style>
