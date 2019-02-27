<template>
  <div class="page main-landing-page">
    <slick
      ref="slick"
      :options="slickOptions"
      @afterChange="handleAfterChange"
    >
      <div>
        <div class="slide">
          <div><img src="/static/images/img_landing_albums.jpg"></div>
          <p>
            Free streaming.<br>
            Free downloading.<br>
            No ads.
          </p>
        </div>
      </div>

      <div>
        <div class="slide">
          <div><img src="/static/images/img_landing_products.jpg"></div>
          <p>
            Share content &<br>
            earn money.<br>
            Shop.
          </p>
        </div>
      </div>

      <div>
        <div class="slide">
          <div><img src="/static/images/img_landing_videos.jpg"></div>
          <p>
            Live video chat<br>
            with artists &<br>
            friends.
          </p>
        </div>
      </div>

      <div>
        <div class="slide">
          <div><img class="promote" src="/static/images/img_landing_promote.jpg"></div>
        </div>
      </div>
    </slick>
  </div>
</template>

<script type="text/javascript" src="./main_landing.ctrl.js"></script>
