<template>
  <div class="onboarding_comp check-email">
    <div>
      <div class="_title" v-if="this.$store.state.app.onboarding.user_type !== 'listener'">Check your email</div>
    </div>
    <div class="top-icon-wrapper text-center">
      <img
        :src="require('@/assets/send_airplane.svg')"
        alt="send airplane icon"
      />
    </div>

    <div class="bodynote text-center">
      <p>
        We’ve sent an activation link to <br />
        <strong>{{ userEmail }}</strong>
      </p>

      <p>
        Click the link sent to activate your account. <br> Please
        allow up to 
        <strong>72 hours for verification</strong>.
      </p>
    </div>

    <div class="text-center resend-mail" @click="sendConfirmEmail">Resend email</div>

    <div class="text-center">
      <v-btn depressed dark round class="px-2" @click="initAppDownload = true">Download App</v-btn>
    </div>

    <NavFooter
      :current="current"
      @nextStage="handleNextStage"
      @prevStage="handlePrevStage"
    />

    <v-dialog v-model="initAppDownload" content-class="download-app-dialog">
      <download-app />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DownloadApp from "@/components/downloadApp.vue";
import NavFooter from "./navFooter";
import AuthService from "@/services/auth"

export default {
  components: {
    NavFooter,
    DownloadApp
  },
  data() {
    return {
      initAppDownload: false
    }
  },
  computed: {
    ...mapState({
      current: state => state.app.onboarding.current,
      userEmail: state => state.app.onboarding.email,
    }),
  },
  methods: {
    ...mapActions({
      gotoNextStage: "app/nextOnboardingStage",
      gotoPrevStage: "app/prevOnboardingStage"
    }),
    handleNextStage() {
      this.gotoNextStage(this.current+1)
    },
    handlePrevStage() {
      if (this.current !== 1) {
        this.gotoPrevStage(this.current-1)
      }
    },
    sendConfirmEmail() {
      const params = {
        email: this.userEmail,
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
  created() {
    debugger
    // this.sendConfirmEmail()
  },
};
</script>

<style lang="scss" scoped>

._title{
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 50px;
}

.bodynote{
  margin: 60px 0 30px;
  color: black;
}
.check-email {
  font-size: 14px;

  .resend-mail {
    margin: 0px 0 50px;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
