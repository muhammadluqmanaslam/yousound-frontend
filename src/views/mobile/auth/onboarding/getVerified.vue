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
          :class="{ '_filled': socialChannel }"
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

      <input v-model="socialUsername" class="_socialHandle width100" type="text" />
    </div>

    <div class="footnote">
        If we need to contact you we will send a direct message from <strong>@yousoundapp</strong>
    </div>
    <VueLoadingButton
      @click.native="handleClick"
      :loading="isLoading"
      style="padding-left: 40%;"
    >
      <NavFooter
        :nextValidated="validated('skipToast')"
        :current="current"
        @nextStage="handleNextStage"
        @prevStage="handlePrevStage"
      />
    </VueLoadingButton>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import NavFooter from "./navFooter";
import AuthService from '@/services/auth';
import VueLoadingButton from "vue-loading-button";


export default {
  components: {
    NavFooter,
    VueLoadingButton
  },
  data() {
    return {
      isLoading: false,
      socialChannel: "",
      socialUsername: "@",
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
      getSocialChannel: (state) => state.app.onboarding.social_provider,
      getSocialUsername: (state) => state.app.onboarding.social_user_name,
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
    socialUsername(val) {
      if (val.length < 2) {
        this.socialUsername = "@";
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

      const { socialChannel, socialUsername } = this;
      const valSocialUsername = socialUsername.length > 1
      const toValidate = [socialChannel, valSocialUsername];

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
    async handleNextStage() {
      if (this.validated()) {
        const data = {
          social_provider: this.socialChannel.title,
          social_user_name: this.socialUsername,
        };
        this.updateOnboarding(data);
        let user_params = this.$store.state.app.onboarding
        let formData = new FormData();

        formData.append('user[email]', user_params.email)
        formData.append('user[password]', user_params.password)
        formData.append('user[username]', user_params.username)
        formData.append('user[display_name]', user_params.fullName)
        formData.append('user[avatar]', user_params.avatar)
        formData.append('user[first_name]', user_params.first_name)
        formData.append('user[last_name]', user_params.last_name)
        formData.append('user[country]', user_params.country)
        formData.append('user[city]', user_params.city)
        formData.append('user[age_group]', user_params.age_group)
        formData.append('user[social_provider]', user_params.social_provider)
        formData.append('user[social_user_id]', user_params.social_user_name)
        formData.append('user[user_type]', user_params.user_type)


        await AuthService.registerAsArtist(formData).then(response => {
          this.gotoNextStage(this.current + 1);
        })
        .catch((e) => {
          this.$store.dispatch("error/showErrorToast", e.body.errors)
        })
      }
    },
    handlePrevStage() {
      if (this.current !== 1) {
        this.gotoPrevStage(this.current - 1);
      }
    },
    handleClick() {
      if(this.validated()) {
        this.isLoading = true
        this.$store.dispatch('error/showLoadingActivity', true)

        .catch((e) => {
          this.$store.dispatch("error/showErrorToast", e.body.errors);
        })
      }
    }
  },
  created() {
    this.socialChannel = this.getSocialChannel;
    this.social_user_name = this.getsocial_user_name;
  },
};
</script>

<style lang="scss" src="../../../../../static/styles/onboarding.scss"></style>
