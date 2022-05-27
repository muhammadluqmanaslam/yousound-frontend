<template>
  <div class="account-info">
    <div class="form-group">
      <div class="_title">Full Name</div>
      <input
        v-model="fullName"
        class="_fullname"
        type="text"
        placeholder="Full Name"
      />
    </div>

    <div class="form-group">
      <div class="_title">Email</div>
      <input v-model="email" class="_email" type="text" placeholder="Email" />
    </div>

    <div class="form-group">
      <div class="_title">Password</div>
      <input
        v-model="password"
        class="_password"
        type="text"
        placeholder="Password"
      />
    </div>

    <NavFooter
      :current="current"
      @nextStage="handleNextStage"
      @prevStage="handlePrevStage"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import NavFooter from "./navFooter";

export default {
  components: {
    NavFooter,
  },
  data() {
    return {
      fullName: "",
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
    }),
    validated() {
      const { fullName, email, password } = this;
      const toValidate = [fullName, email, password];

      const isValid = toValidate.every((item) => item);
      return isValid;
    },
  },
  methods: {
    ...mapActions({
      gotoNextStage: "app/nextOnboardingStage",
      gotoPrevStage: "app/prevOnboardingStage",
    }),
    ...mapMutations({
      updateOnboarding: "app/updateOnboarding",
    }),
    handleNextStage() {
      if (this.validated) {
        const data = {
          fullName: this.fullName,
          email: this.email,
          password: this.password,
        };
        this.updateOnboarding(data);

        this.gotoNextStage(this.current + 1);
      }
    },
    handlePrevStage() {
      if (this.current !== 1) {
        this.gotoPrevStage(this.current - 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-group {
  input {
    width: 100%;
    padding-left: 35px;

    &::placeholder {
      padding-left: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }
    &:focus {
      border: 2px solid #000000;
    }
    &._fullname {
      padding-left: 10px;

      &::placeholder {
        padding-left: 0px;
      }
    }
    &._email {
      background: url("../../../../assets/mail_icon_outline.svg") no-repeat
        scroll 7px 13px;
    }
    &._password {
      background: url("../../../../assets/password_outline.svg") no-repeat
        scroll 7px 13px;
    }
  }
}
</style>