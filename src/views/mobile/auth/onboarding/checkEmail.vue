<template>
  <div class="check-email">
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
        Click the link sent to activate your account. Creator accounts please
        allow up to <br />
        <strong>72 hours for verification</strong>.
      </p>
    </div>

    <NavFooter
      :current="current"
      @nextStage="handleNextStage"
      @prevStage="handlePrevStage"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NavFooter from "./navFooter";

export default {
  components: {
    NavFooter
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
    }
  },
};
</script>

<style>
</style>
