<template>
  <div class="footer-navigator">
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
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    nextValidated: Boolean,
    prevValidated: Boolean,
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
    }),
    ...mapGetters({
      stages: "app/onboardingStages",
    }),
  },
  methods: {
    handleNextStage() {
      console.log("next")
      this.$emit("nextStage")
    },
    handlePrevStage() {
      console.log("prev")
      this.$emit("prevStage")
    }
  },
};
</script>

<style lang="scss" scoped>
.footer-navigator {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
