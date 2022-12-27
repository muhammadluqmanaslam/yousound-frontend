<template>
  <div class="item-swipe">
    <div
        ref="swipeEle"
        class="swipe-item swipe-wrapper"
        :class="{slideRight, slideLeft}"
        @mouseup="initEvent"
    >
        <slot name="leftComponent"></slot>
    </div>
    <div
        class="swipe-item side-tab"
        :class="{slideRight}"
    >
        <slot name="rightComponent"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transformProp: {
        x: 0,
        y: 0,
        rotation: 0,
      },
      slideRight: false,
      slideLeft: false,
      xDown: null,
      yDown: null,
      xUp: null,
      yUp: null,
    };
  },
  computed: {
    elSwipe() {
      return this.$refs.swipeEle;
    },
  },
  watch: {
    // slideLeft(val) {
    //     if (val) {
    // }
  },
  methods: {
    initEvent() {
      this.elSwipe.addEventListener("touchstart", this.handleTouchStart, false);
      this.elSwipe.addEventListener("touchmove", this.handleTouchMove, false);
    },
    removeEvent() {
      this.elSwipe.removeEventListener("touchstart", this.handleTouchStart, false);
      this.elSwipe.removeEventListener("touchmove", this.handleTouchMove, false);
    },
    getTouches(evt) {
      return evt.touches;
    },
    handleTouchStart(evt) {
      const firstTouch = this.getTouches(evt)[0];
      this.xDown = firstTouch.clientX;
      this.yDown = firstTouch.clientY;
    },
    handleTouchMove(evt) {
      if (!this.xDown || !this.yDown) {
        return;
      }

      this.xUp = evt.touches[0].clientX;
      this.yUp = evt.touches[0].clientY;

      var xDiff = this.xDown - this.xUp;
      var yDiff = this.yDown - this.yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /* most significant */
        if (xDiff > 0) {
          /* right swipe */
          this.slideRight = true;
          this.slideLeft = false;
        } else {
          /* left swipe */
          this.slideLeft = true;
          this.slideRight = false;
        }
      } else {
        if (yDiff > 0) {
          /* down swipe */
        } else {
          /* up swipe */
        }
      }
      /* reset values */
      this.xDown = null;
      this.yDown = null;
    },
  },
  mounted() {
    this.initEvent();
  },
  beforeDestroy() {
    this.removeEvent();
  },
};
</script>

<style lang="scss" scoped>
.item-swipe {
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
}
.swipe-wrapper {
    width: 100%;
    // background: red;
    transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    will-change: transform;

    &.slideRight {
        transform: translate3D(-48px, 0px, 0) rotate(0deg);
    }
}
    .side-tab {
        height: 100%;
        width: 50px;
        background: blue;
        margin-left: -48px;
        transform: translate3D(50px, 0px, 0) rotate(0deg);
        transition: transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        will-change: transform;

        .btn {
            height: 100%;
            margin: 0;
            width: 100%;
            max-width: 0;
            min-width: 100%;
            border-radius: 0;
        }
        &.slideRight {
            transform: translate3D(0px, 0px, 0) rotate(0deg);
        }
    }
</style>
