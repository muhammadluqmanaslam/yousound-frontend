<template>
  <div class="stager" :class="[`_${staging}`, { isDark: currentStage.isDark }]">
    <div v-if="hideStagerTitle" class="_titlex" v-html="currentStage.title"></div>

    <div v-if="current > 1 && hideStagerBar" class="stages">
      <div
        v-for="(stage, index) in stages.slice(1, stages.length)"
        :key="index"
        class="stage dflex"
        :class="{ _current: current === stage.stage }"
      >
        <!-- <pre>{{ stage}}</pre> -->
      </div>
    </div>

    <div class="_meta">
      <div
        v-if="currentStage.subtitle"
        class="_subtitle"
        v-html="currentStage.subtitle"
      ></div>

      <div v-if="currentStage.cta1" class="cta cta1">
        <v-btn
          depressed
          round
          dark
          class="px-2"
          :style="`background-color: ${currentStage.cta1.color}`"
          @click="handleCTA(currentStage.cta1.action)"
        >
          <strong>
            {{ currentStage.cta1.title }}
          </strong>
        </v-btn>
      </div>

      <div v-if="currentStage.cta2" class="cta cta2">
        <v-btn :ripple="false" depressed round class="no-Btn-bg transparent">
          <strong>
            {{ currentStage.cta2.title }}
          </strong>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  props: {
    staging: {
      type: String,
      required: true,
    },
    ownCurrent: Number,
    ownStages: Array,
  },
  data() {
    return {
      current: 1,
      stages: [],
      currentStage: {},
    };
  },
  computed: {
    ...mapGetters({
      onboardingStages: "app/onboardingStages",
      onboardingCurrentStage: "app/onboardingCurrentStage",
      activationStages: "app/activationStages",
      activationCurrentStage: "app/activationCurrentStage",
    }),
    ...mapState({
      onboardingCurrent: (state) => state.app.onboarding.current,
    }),
    hideStagerBar() {
      return !this.onboardingCurrentStage.hideStagerBar
    },
    hideStagerTitle() {
      return !this.onboardingCurrentStage.hideStagerBar
    },
  },
  watch: {
    onboardingCurrent(val) {
      this.current = val;
      this.stages = this.onboardingStages;
      this.currentStage = this.onboardingCurrentStage;
    },
    ownCurrent: {
      handler(val) {
        switch (this.staging) {
          case "onboarding":
            break;
          case "activation":
            this.current = val;
            this.stages = this.activationStages;
            this.currentStage = this.activationCurrentStage;
            break;
          default:
            break;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      nextActivationStage: "app/nextActivationStage",
      prevActivationStage: "app/prevActivationStage",
    }),
    handleCTA(action) {
      switch (action) {
        case "next":
          if (this.staging == "activation") {
            return this.$emit("updateCurrent", this.current+1)
          }
          
          break;
      
        default:
          break;
      }
    },
    initStaging() {
      switch (this.staging) {
        case "onboarding":
          this.current = this.$store.state.app.onboarding.current;
          this.stages = this.onboardingStages;
          this.currentStage = this.onboardingCurrentStage;
          break;
        case "activation":
          this.current = this.ownCurrent;
          this.stages = this.activationStages;
          this.currentStage = this.activationCurrentStage;
          break;
        default:
          break;
      }
    },
  },
  created() {
    this.initStaging();
  },
};
</script>

<style lang="scss" scoped>
.stager {
  position: absolute;
  top: 0;
  width: 100%;

  &._activation {
    padding-top: 12%;
    z-index: 4;

    ._titlex {
      color: #ffffff;
      width: 70%;
      margin: 0 auto;
      line-height: 1.3;
    }

    .stages {
      margin-top: 10px;

      .stage {
        background-color: #ffffff;
      }
    }
  }

  &.isDark {
    ._titlex {
      color: #000000;
    }
    ._subtitle {
      color: #000000;
    }
    .stages {
      .stage {
        background-color: #000000;
      }
    }
  }
}
._titlex {
  text-align: center;
  margin-bottom: 15px;
  font-size: 28px;
  font-weight: 900;
}
._subtitle {
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  width: 90%;
  margin: 0 auto;
  margin-top: 7%;
  font-weight: 500;

  /deep/ .highlight {
    color: #efff38;
  }
}
.cta {
  text-align: center;
  margin-top: 3%;
}
.stages {
  display: flex;
  justify-content: center;
  align-items: center;

  .stage {
    height: 3px;
    border-radius: 50px;
    background-color: #b3b3b3;
    width: 12px;

    &._current {
      width: 50px;
      background-color: #000000;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>