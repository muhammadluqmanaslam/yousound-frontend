<template>
  <div class="onboarding_comp get-verified">
    <div class="form-group">
      <div class="_title">Social channel</div>
      <v-menu
        bottom
        left
        offset-y
        :nudge-top="-5"
        :nudge-left="0"
        class="social-type-menu"
        content-class="social-menu__content"
      >
        <v-select
          :placeholder="socialChannel ? socialChannel.title : 'Choose'"
          class="social-types-selector"
          :class="{ '_filled': accountType }"
          single-line
          hide-details
          slot="activator"
        ></v-select>

        <div
          v-for="(channel, i) in socialChannels"
          :key="i"
          @click="selectedChannel(channel)"
          class="channel-info"
          :class="[`${channel.id}-menu`]"
        >
          <div class="_title">{{ channel.title }}</div>
          <div class="_tags">
            {{ channel.tags }}
          </div>
        </div>
      </v-menu>

      <input v-model="socialHandle" class="_socialHandle width100" type="text" />
    </div>

    <div class="footnote">
        If we need to contact you we will send a direct message from <strong>@yousoundapp</strong>
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
import { mapActions, mapMutations, mapState } from 'vuex';
import NavFooter from "./navFooter";

export default {
  components: {
    NavFooter,
  },
  data() {
    return {
      socialChannel: "",
      socialHandle: "@",
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
      getSocialChannel: (state) => state.app.onboarding.socialChannel,
      getSocialHandle: (state) => state.app.onboarding.socialHandle,
    }),
    socialChannels() {
      return [
        {
          title: "Facebook",
          id: "facebook",
        },
        {
          title: "Instagram",
          id: "instagram",
        },
        {
          title: "Twitter",
          id: "twitter",
        },
        {
          title: "Tik Tok",
          id: "tiktok",
        },
      ];
    },
  },
  watch: {
    socialHandle(val) {
      if (val.length < 2) {
        this.socialHandle = "@";
      }
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
    validated(toastStatus) {
      const skipToast = toastStatus === "skipToast"

      const { socialChannel, socialHandle } = this;
      const valSocialhandle = socialHandle.length > 1
      const toValidate = [socialChannel, valSocialhandle];

      const errors = [
        "Please choose a social channel",
        "Please enter a valid social handle",
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
    selectedChannel(channel) {
      this.socialChannel = channel;
    },
    handleNextStage() {
      if (this.validated()) {
        const data = {
          socialChannel: this.socialChannel,
          socialHandle: this.socialHandle,
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
    this.socialChannel = this.getSocialChannel;
    this.socialHandle = this.getSocialHandle;
  },
};
</script>

<style lang="scss" src="../../../../../static/styles/onboarding.scss"></style>
