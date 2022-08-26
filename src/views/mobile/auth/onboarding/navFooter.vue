<template>
  <div class="onboarding-navigator" :class="{ onMobile }">
    <div v-if="onMobile" class="arrow-holder">
      <img
        :src="require('@/assets/arrow_back.svg')"
        alt="back icon"
        @click="handlePrevStage()"
      />

      <img
        v-if="current > 1 && current < stages.length + 1"
        :src="require('@/assets/arrow_front_circle.svg')"
        alt="forward icon"
        @click="handleNextStage()"
      />
    </div>

    <div v-else class="arrow-holder desktop">
      <transition name="fade">
        <v-icon v-if="current > 1" @click="handlePrevStage()">
          arrow_back
        </v-icon>
      </transition>

      <span class="mx-1"></span>

      <transition name="fade">
        <v-icon
          v-if="
            forceShowNextIcon || (current > 1 && current < stages.length + 1)
          "
          :class="{_disabled: !nextValidated}"
          @click="handleNextStage()"
        >
          arrow_forward
        </v-icon>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    nextValidated: Boolean,
    prevValidated: Boolean,
    forceShowNextIcon: Boolean,
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
    }),
    ...mapGetters({
      stages: "app/onboardingStages",
    }),
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    handleNextStage() {
      console.log("next");
      this.$emit("nextStage");
    },
    handlePrevStage() {
      console.log("prev");
      this.$emit("prevStage");
    },
  },
};
</script>

<style lang="scss" scoped>
.onboarding-navigator {
  margin-top: 10%;

  .arrow-holder {
    &.desktop {
      text-align: center;

      .icon {
        font-size: 21px;
        color: #000000;
        border: 2px solid #000000;
        cursor: pointer;
        border-radius: 100px;
        padding: 6px;

        &._disabled {
          color: #ffffff;
          background-color: #D9D9D9;
          cursor: auto;
          border-color: #D9D9D9;
        }
      }
    }
  }

  &.onMobile {
    position: absolute;
    bottom: 0;
    margin-top: 0;

    .arrow-holder {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
