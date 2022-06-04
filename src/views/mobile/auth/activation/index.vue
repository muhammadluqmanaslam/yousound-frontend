<template>
  <div class="page no-top-nav account-activation">
    <Stager
      staging="activation"
      :ownCurrent="current + 1"
      :ownStages="stages"
      @updateCurrent="updateCurrent"
    />

    <v-carousel
      v-model="current"
      ref="stageSwipe"
      hide-delimiters
      hide-controls
      :cycle="false"
      :class="{endLeft, endRight}"
    >
      <v-carousel-item
        v-for="(stage, i) in stages"
        :key="i"
        :style="`background-color: ${stage.color}`"
        :src="stage.color"
        @touchstart.native="touchStart"
        @touchend.native="touchEnd"
      >

        <v-spacer></v-spacer>
        <img
          :src="stage.image"
          width="50%"
          class="stage-img"
          :class="[`stage-${stage.stage}`]"
          alt="yousound"
        />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script src="./index.ctrl.js"></script>

<style lang="scss" src="../../../../../static/styles/activation.scss"></style>
