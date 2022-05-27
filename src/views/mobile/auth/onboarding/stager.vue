<template>
  <div class="stager">
    <div class="_title">{{ currentStage.title }}</div>

    <div v-if="current > 1" class="stages">
      <div
        v-for="(stage, index) in stages.slice(1, stages.length)"
        :key="index"
        class="stage dflex"
        :class="{ _current: current === stage.stage }"
      >
        <!-- <pre>{{ stage}}</pre> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
    }),
    ...mapGetters({
      stages: "app/onboardingStages",
      currentStage: "app/currentStage",
    }),
  },
  updated() {
    console.log('stager', this.stages)
    console.log('stager: current', this.current)
    console.log('stager: currentStage', this.currentStage)
  }
};
</script>

<style lang="scss" scoped>
.stager {
  position: absolute;
  top: 0;
  width: 100%;
}
._title {
  text-align: center;
  margin-bottom: 15px;
  font-size: 2em;
  font-weight: 900;
}
.stages {
  display: flex;
  justify-content: center;
  align-items: center;

  .stage {
    height: 2px;
    border-radius: 50px;
    background-color: #888888;
    width: 10px;

    &._current {
      width: 70px;
      background-color: #000000;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>