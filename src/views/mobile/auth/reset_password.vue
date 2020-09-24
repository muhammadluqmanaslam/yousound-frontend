<template>
  <div class="mobile-auth-confirm-page">
    <mobile-header theme="light" :show-menu="false" />

    <div v-if="!done" class="section">
      <h3>Reset Your Password</h3>
      <form v-on:submit.prevent="submit()">
        <div>
          <div
            class="form-group"
            :class="{ 'has-error': errors.has('password') }"
          >
            <input
              v-model="password"
              v-validate="'required|min:6'"
              :class="{ input: true, 'text-danger': errors.has('password') }"
              name="password"
              type="password"
              placeholder="Password"
            />
            <p class="text-danger text-xs-left" v-if="errors.has('password')">
              {{ errors.first('password') }}
            </p>
          </div>
        </div>
        <div>
          <div
            class="form-group"
            :class="{ 'has-error': errors.has('confirm_password') }"
          >
            <input
              v-model="confirm_password"
              v-validate="'required|confirmed:password'"
              :class="{
                input: true,
                'text-danger': errors.has('confirm_password'),
              }"
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
            />
            <p
              class="text-danger text-xs-left"
              v-if="errors.has('confirm_password')"
            >
              {{ errors.first('confirm_password') }}
            </p>
          </div>
        </div>
        <div>
          <button :disabled="loading" type="submit">Update Password</button>
        </div>
      </form>
    </div>
    <div v-else class="section">
      <h3>Password has been updated!</h3>
      <a href="ys://login">Open App</a>
    </div>

    <v-snackbar
      v-model="showError"
      multi-line
      top
      :timeout="$store.state.error.timeout"
      :color="$store.state.error.color"
    >
      <label>{{ $store.state.error.errors[0] }}</label>
      <v-btn dark flat @click.native="$store.dispatch('error/hideToast')"
        ><v-icon>clear</v-icon></v-btn
      >
    </v-snackbar>
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
      loading: false,
      token: null,
      done: false,
      password: '',
      confirm_password: '',
    }
  },

  computed: {
    showError: {
      get: function () {
        return this.$store.state.error.showError
      },

      set: function (newValue) {
        this.$store.dispatch('error/hideToast')
      },
    },
  },

  created() {},

  methods: {
    submit() {
      const vm = this
      this.$validator
        .validateAll()
        .then(function (response) {
          if (response === true) {
            vm.loading = true
            const params = {
              reset_token: vm.$route.params.token,
              password: vm.password,
            }
            AuthService.resetPassword(params)
              .then(() => {
                vm.loading = false
                vm.done = true
              })
              .catch((e) => {
                vm.loading = false
                vm.$store.dispatch(
                  'error/showErrorToast',
                  // e.body.errors || [e.body]
                  vm._.map(
                    e.body.errors,
                    (msg) => `reset_password_token ${msg.detail}`
                  )
                )
              })
          }
        })
        .catch(function (e) {
          console.log('error', e)
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
      height: 40px;
      margin-top: 30px;
      padding: 0 30px;
      border-radius: 40px;
      color: #ffffff;
      background-color: #000;
      line-height: 40px;
      font-size: 16px;
      font-weight: 700;
    }

    form {
      width: 100%;
      padding: 20px;
    }

    input {
      width: 100%;
      padding: 0 12px;
    }

    button {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      background-color: #000000;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
    }
    button:disabled,
    button[disabled] {
      background-color: #cccccc !important;
    }
  }

  .header-container {
    position: absolute;
  }
}
</style>
