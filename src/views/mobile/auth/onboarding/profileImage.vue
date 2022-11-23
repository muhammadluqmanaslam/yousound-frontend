<template>
  <div class="onboarding_comp profile-image">
    <label for="profileImage">
      <div
        class="profile-image-holder"
        :style="`background-image: url(${
          profileImage ? profileImage : pickerImg
        })`"
      ></div>
    </label>

    <input
      type="file"
      name="profile_image"
      id="profileImage"
      class="profile-image-picker"
      accept="image/*"
      @change="imageChanged($event)"
    />

    <label v-if="profileImage" for="profileImage">
      <div class="action-info">Tap to replace</div>
    </label>
    <label v-else for="profileImage">
      <div class="action-info">Tap to upload</div>
    </label>

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
      profileImage: "",
    };
  },
  computed: {
    ...mapState({
      current: state => state.app.onboarding.current,
      getProfileImage: state => state.app.onboarding.profileImage,
    }),
    pickerImg() {
      return require("@/assets/file_upload.svg");
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

      const { profileImage } = this;
      const toValidate = [profileImage];

      const errors = [
        "Please upload a valid profile image",
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
    imageChanged(e) {
      if (e.target.files[0].size > 2097152) {
        this.$store.dispatch("error/showErrorToast", [
          "You can upload an image 2MB in maximum",
        ]);
        return;
      }

      this.avatar = e.target.files[0];
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        (event) => {
          this.profileImage = event.target.result;
        },
        false
      );
      reader.readAsDataURL(this.avatar);
    },
    handleNextStage() {
      if (this.validated()) {
        const data = {
          profileImage: this.profileImage,
          avatar: this.avatar
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
    this.profileImage = this.getProfileImage;
  },
};
</script>

<style lang="scss" scoped>
.profile-image-picker {
  opacity: 0 !important;
  height: 1px;
  width: 1px;
}
.profile-image-holder {
  cursor: pointer;
  position: relative;
  height: 220px;
  width: 220px;
  border-radius: 100%;
  margin: 0 auto;
  background-position: center;
  background-size: cover;

  &::after {
    content: "";
    border: 10px solid rgba(255, 255, 255, 0.4);
    width: 100%;
    height: 100%;
    /* background: red; */
    position: absolute;
    border-radius: 100%;
  }
  &:hover{
    &:after {
      border: 10px solid rgba(150, 150, 150, 0.75);
    }
  }
}

.action-info {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
</style>