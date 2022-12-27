<template>
    <div>
        <!-- <CircleProgress
        :percent="80"
      /> -->
      <!-- <circle-progress :percent="40" /> -->

      <div class="progress-bar-main" @click="pauseChart = !pauseChart">
        <img v-if="pauseChart" src="../../assets/play.svg" width="12">
        <img v-else src="../../assets/pause.svg" width="12">
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      pauseChart: false,
    }
  },
}

</script>

<style src="./radial.scss" lang="scss" scoped></style>
