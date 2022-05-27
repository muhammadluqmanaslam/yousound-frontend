<template>
  <div class="get-verified">
    <div class="form-group">
      <div class="_title">Social channel</div>
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
          :placeholder="socialChannel ? socialChannel.title : 'Choose'"
          class="account-types-selector"
          single-line
          hide-details
          slot="activator"
        ></v-select>

        <div
          v-for="(channel, i) in socialChannels"
          :key="i"
          @click="selectedChannel(channel)"
          class="account-info"
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
    validated() {
      const { socialChannel, socialHandle } = this;
      const valSocialhandle = socialChannel.length > 1
      const toValidate = [socialChannel, valSocialhandle];

      const isValid = toValidate.every((item) => item);
      return isValid;
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
    selectedChannel(channel) {
      this.socialChannel = channel;
    },
    handleNextStage() {
      if (this.validated) {
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
};
</script>

<style lang="scss" scoped>
.account-type-menu {
    width: 100%;
    margin-bottom: 8px;
}
._socialHandle {
  color: #000000;
  font-weight: bold;
}
</style>