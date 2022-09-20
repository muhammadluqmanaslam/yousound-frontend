<template>
  <div class="onboarding_comp account-info">
    <div class="form-group">
      <div class="_title">Full Name</div>
      <input
        v-model="fullName"
        class="_fullname"
        :class="{_filled: fullName}" 
        type="text"
        placeholder="Full Name"
      />
    </div>

    <div class="form-group">
      <div class="_title">Email</div>
      <input v-model="email" class="_email" :class="{_filled: email}" type="email" placeholder="Email" />
    </div>

    <div class="form-group">
      <div class="_title">Password</div>
      <input
        v-model="password"
        class="_password"
        type="password"
        placeholder="Password"
      />
    </div>

    <NavFooter
      :nextValidated="validated('skipToast')"
      :current="current"
      @nextStage="handleNextStage"
      @prevStage="handlePrevStage"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import NavFooter from "./navFooter";
import AuthService from "@/services/auth";

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
      getFullName: (state) => state.app.onboarding.fullName,
      getEmail: (state) => state.app.onboarding.email,
      getPassword: (state) => state.app.onboarding.password,
    }),
  },
  methods: {
    ...mapActions({
      gotoNextStage: "app/nextOnboardingStage",
      gotoPrevStage: "app/prevOnboardingStage",
    }),
    ...mapMutations({
      updateOnboarding: "app/updateOnboarding",
    }),
    validated(toastStatus) {
      const skipToast = toastStatus === "skipToast"

      const { fullName, email, password } = this;
      const valFullName = fullName && fullName.split(" ").length > 1;
      const valEmail = this.validateEmail(email)
      const valPassword = this.validatePassword(password)
      const toValidate = [valFullName, valEmail, valPassword];

      const errors = [
        "Please enter a valid full name",
        "Please enter a valid email address",
        "Password must be Min. 8 characters with at least one capital letter, a number and a special character.",
      ];

      const isValid = toValidate.every((item, index) => {
        if (!skipToast && !item) {
          this.$store.dispatch("error/showErrorToast", [errors[index]]);
          return item;
        }
        return item;
      });
      return isValid;
    },
    validateEmail(email) {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          email
        )
      ) {
        return true;
      }
      return false;
    },
    validatePassword(password) {
      if (
        /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*([^\w\s]|[_]))\S{8,}$/.test(
          password
        )
      ) {
        return true;
      }
      return false;
    },
    async handleNextStage() {
      let isEmailAvailable = false;
      await AuthService.isEmailAvailable({email: this.email})
        .then((res) => {
          isEmailAvailable = true
        })
        .catch((e) => {
          this.$store.dispatch("error/showErrorToast", ["Email already exist"])
          isEmailAvailable = false
        })

      if (this.validated() && isEmailAvailable) {
        const data = {
          fullName: this.fullName,
          first_name: this.fullName.split(" ").slice(0, 1).join(" "),
          last_name: this.fullName.split(" ").slice(1, this.fullName.length).join(" "),
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
  created() {
    this.fullName = this.getFullName;
    this.email = this.getEmail;
    this.password = this.getPassword;
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