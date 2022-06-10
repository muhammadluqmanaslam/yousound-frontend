<template>
  <div
    class="item-tab-wrapper"
    :class="{isSwipe, 'isGrid container fluid grid-list-lg px-0 pt-0': isGrid}"
    :style="`min-height: ${minHeight}px;`"
  >
    <div
      class="item-tabs"
      :class="{'layout row wrap': isGrid}"
    >
      <slot name="itemTabs"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    minHeight: {
      type: [String, Number],
      default: 275,
    },
    mode: {
      type: String,
      default: "swipe",
    },
  },
  computed: {
    isSwipe() {
      return this.mode === "swipe";
    },
    isGrid() {
      return this.mode === "grid";
    },
  },
}
</script>

<style lang="scss" scoped>
.item-tab-wrapper {
  &.isSwipe {
    position: relative;
    overflow-x: scroll;
    // min-height: 275px;
    width: calc(100% + 40px);

    .item-tabs {
      display: inline-flex;
      // position: absolute;
    }

    .tab-holder {
      width: 200px;
      margin-right: 20px;
    }
  }

  &.isGrid {
    /deep/ .track-card .track-info .track-detail {
      margin-left: 11px;
    }
  }
}
</style>
