<template>
  <div class="item-tab-wrapper">
    <div class="item-tabs">
      <slot name="itemTabs"></slot>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.item-tab-wrapper {
  position: relative;
  overflow-x: scroll;
  min-height: 275px;
  width: calc(100% + 40px);

  .item-tabs {
    display: flex;
    position: absolute;
  }

  .tab-holder {
    width: 200px;
    margin-right: 15px;
  }
}
</style>
