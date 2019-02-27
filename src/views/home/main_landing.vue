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
        <ul class="dots">
          <li @click="activeSlide = 1" class="active"></li>
          <li @click="activeSlide = 2"></li>
          <li @click="activeSlide = 3"></li>
          <li @click="activeSlide = 4"></li>
        </ul>
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
        <ul class="dots">
          <li @click="activeSlide = 1"></li>
          <li @click="activeSlide = 2" class="active"></li>
          <li @click="activeSlide = 3"></li>
          <li @click="activeSlide = 4"></li>
        </ul>
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
        <ul class="dots">
          <li @click="activeSlide = 1"></li>
          <li @click="activeSlide = 2"></li>
          <li @click="activeSlide = 3" class="active"></li>
          <li @click="activeSlide = 4"></li>
        </ul>
      </div>

      <div class="slide slide-4">
        <div class="slide__content">
          <div>
            <img src="/static/images/img_landing_promote.jpg">
          </div>
        </div>
        <ul class="dots">
          <li @click="activeSlide = 1"></li>
          <li @click="activeSlide = 2"></li>
          <li @click="activeSlide = 3"></li>
          <li @click="activeSlide = 4" class="active"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./main_landing.ctrl.js"></script>
