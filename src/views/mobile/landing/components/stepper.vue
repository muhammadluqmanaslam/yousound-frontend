<template>
  <div class="step-container">
    <span
      v-for="(step, index) in steps"
      :class="{ 'active':  index + 1 == activeIndex }"
    >
    </span>
  </div>
</template>

<script>
export default {
  props: {
    stepSize: {
      type: Number,
      default: 1
    },
    activeIndex: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      steps: []
    }
  },

  created () {
    this.steps = new Array(this.stepSize)
  }
}
</script>

<style lang="scss" scoped>
.step-container {
  height: 30px;
  span {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    &.active {
      background-color: #ffffff;
    }
  }
  span + span {
    margin-left: 10px;
  }
}
</style>
