<template>
  <div class="page main-landing-page">
    <slick
      ref="slick"
      :options="slickOptions"
      @afterChange="handleAfterChange"
    >
      <div class="slide">
        <img src="/static/images/img_landing_albums.jpg"></v-flex>
        <p>
          Free streaming,<br>
          Free downloading,<br>
          No ads
        </p>
      </div>

      <div class="slide">
        <img src="/static/images/img_landing_products.jpg">
        <p>
          Share content &<br>
          earn money.<br>
          Shop
        </p>
      </div>

      <div class="slide">
        <img src="/static/images/img_landing_videos.jpg">
        <p>
          Live video chat<br>
          with artists &<br>
          friends.
        </p>
      </div>

      <div class="slide">
        <img class="promote" src="/static/images/img_landing_promote.jpg">
      </div>
    </slick>
  </div>
</template>

<script type="text/javascript" src="./main_landing.ctrl.js"></script>
