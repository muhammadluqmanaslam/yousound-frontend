<template>
  <div class="onboarding_comp account-type">
    <div class="_title">Account type</div>
    <v-menu
      bottom
      left
      offset-y
      :nudge-top="-5"
      :nudge-left="0"
      class="account-type-menu"
      content-class="account-menu__content"
    >
      <v-select
        :placeholder="accountType ? accountType.title : 'Select'"
        class="account-types-selector"
        :class="{ 'acc-selected _filled': accountType }"
        single-line
        hide-details
        slot="activator"
      ></v-select>

      <div
        v-for="(type, i) in accountTypes"
        :key="i"
        @click="selectedAccount(type)"
        class="account-info"
        :class="[`${type.id}-menu`]"
      >
        <div class="_title">{{ type.title }}</div>
        <div class="_tags">
          {{ type.tags }}
        </div>
      </div>
    </v-menu>

    <input
      v-model="username"
      type="text"
      placeholder="@username"
      class="width100 username"
    />

    <NavFooter
      :nextValidated="validated('skipToast')"
      :current="current"
      @nextStage="handleNextStage"
      @prevStage="handlePrevStage"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import NavFooter from "./navFooter";

export default {
  components: {
    NavFooter
  },
  data() {
    return {
      accountType: "",
      username: "",
    };
  },
  computed: {
    ...mapState({
      current: state => state.app.onboarding.current,
      getAccountType: state => state.app.onboarding.accountType,
      getUsername: state => state.app.onboarding.username,
    }),
    accountTypes() {
      const accountTypes = [
        {
          id: "artist",
          title: "Artist",
          tags: "Bands, rappers, producers, podcasters + more",
        },
        {
          id: "brand",
          title: "Brand",
          tags: "Clothing, record labels, lifestyle + more",
        },
      ];

      return accountTypes || [];
    },
  },
  methods: {
    ...mapActions({
      gotoNextStage: "app/nextOnboardingStage",
      gotoPrevStage: "app/prevOnboardingStage"
    }),
    ...mapMutations({
      updateOnboarding: "app/updateOnboarding",
    }),
    validated(toastStatus) {
      const skipToast = toastStatus === "skipToast"

      const { accountType, username } = this;
      const toValidate = [accountType, username];

      const errors = [
        "Please choose an account type",
        "Please enter a valid username",
      ]


      const isValid = toValidate.every((item, index) => {
        if (!skipToast && !item) {
          this.$store.dispatch("error/showErrorToast",[errors[index]])
          return item
        }
        return item
      });
      return isValid;
    },
    selectedAccount(account) {
      this.accountType = account;
    },
    handleNextStage() {
      if (this.validated()) {
        const data = {
          accountType: this.accountType,
          username: this.username,
        }
        this.updateOnboarding(data)

        this.gotoNextStage(this.current+1)
      }
    },
    handlePrevStage() {
      if (this.current !== 1) {
        this.gotoPrevStage(this.current-1)
      }
    }
  },
  created() {
    this.accountType = this.getAccountType;
    this.username = this.getUsername;
  },
};
</script>

<style lang="scss" src="../../../../../static/styles/onboarding.scss"></style>
