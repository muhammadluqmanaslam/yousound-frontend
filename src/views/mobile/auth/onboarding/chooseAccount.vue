<template>
  <div class="choose-account">
    <div
      class="account _listener"
      :class="{ onSelect: accountCategory == 'listener' }"
      @click="chooseAccount('listener')"
    >
      <div class="_title">Listener</div>
      <div class="_subtitle">I want to stream & watch</div>
    </div>

    <div
      class="account _creator"
      :class="{ onSelect: accountCategory == 'creator' }"
      @click="chooseAccount('creator')"
    >
      <div class="_title">Creator</div>
      <div class="_subtitle">I want to upload & sell</div>
    </div>

    <NavFooter
      :nextValidated="validated"
      @nextStage="handleNextStage"
      :forceShowNextIcon="accountCategory.length > 1 || forceShowNextIcon"
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
      accountCategory: "",
      forceShowNextIcon: false,
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
      getAccountCategory: (state) => state.app.onboarding.accountCategory,
    }),
    validated() {
      const { accountCategory } = this;
      const toValidate = [accountCategory];

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
    chooseAccount(category) {
      this.accountCategory = category;
      this.forceShowNextIcon = true;
    },
    handleNextStage() {
      if (this.validated) {
        const data = {
          accountCategory: this.accountCategory,
        };
        this.updateOnboarding(data);
        return this.gotoNextStage(this.current + 1);
      }
    },
  },
  created() {
    this.accountCategory = this.getAccountCategory;
  },
};
</script>

<style lang="scss" scoped>
.account {
  border: 1px solid #d0d0d0;
  border-radius: 12px;
  padding: 15px 20px;
  text-align: center;
  cursor: pointer;

  &.onSelect {
    background-color: #333;
    color: #ffffff;
  }

  &._listener {
    margin-bottom: 20px;
  }

  ._title {
    font-size: 25px;
    font-weight: 600;
  }
  ._subtitle {
    font-size: 14px;
    font-weight: 500;
    color: rbga(0, 0, 0, 0.7);
  }
}
</style>
