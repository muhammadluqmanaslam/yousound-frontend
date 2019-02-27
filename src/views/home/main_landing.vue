<template>
  <div class="page main-landing-page">
    <div class="slides-container" :style="{transform: transform}">
      <div class="slide slide-1">
        <div class="slide__content">
          <div>
            <img src="/static/images/img_landing_albums.jpg">
          </div>
          <p>
            Free streaming.<br>
            Free downloading.<br>
            No ads.
          </p>
        </div>
      </div>

      <div class="slide slide-2">
        <div class="slide__content">
          <div>
            <img src="/static/images/img_landing_products.jpg">
          </div>
          <p>
            Share content &<br>
            earn money.<br>
            Shop.
          </p>
        </div>
      </div>

      <div class="slide slide-3">
        <div class="slide__content">
          <div>
            <img src="/static/images/img_landing_videos.jpg">
          </div>
          <p>
            Live video chat<br>
            with artists &<br>
            friends.
          </p>
        </div>
      </div>

      <div class="slide slide-4">
        <v-layout row wrap>
          <v-flex xs12 sm10 offset-sm1>
            <img src="/static/images/img_landing_promote.jpg">
          </v-flex>
        </v-layout>
      </div>
    </div>

    <ul class="dots">
      <li @click="setActiveSlide(1)" :class="{'active': activeSlide == 1}"></li>
      <li @click="setActiveSlide(2)" :class="{'active': activeSlide == 2}"></li>
      <li @click="setActiveSlide(3)" :class="{'active': activeSlide == 3}"></li>
      <li @click="setActiveSlide(4)" :class="{'active': activeSlide == 4}"></li>
    </ul>
  </div>
</template>

<script type="text/javascript" src="./main_landing.ctrl.js"></script>
