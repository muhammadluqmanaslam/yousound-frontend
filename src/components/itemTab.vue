<template>
  <div class="item-tab-wrapper" :style="`min-height: ${minHeight}px;`">
    <div class="item-tabs">
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
  },
}
</script>

<style lang="scss" scoped>
.item-tab-wrapper {
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
    margin-right: 15px;
  }
}
</style>
