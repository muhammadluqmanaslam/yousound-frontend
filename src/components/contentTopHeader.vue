<template>
  <div class="top-menu">
    <!-- <div class="tab-container"> -->
    <v-toolbar app :fixed="!absolute" :flat="absolute" class="tab-container" :class="{__absolute: absolute}" height="73">
      <!-- {{ absolute }} -->
        <!-- ancestoral element to all top headers -->
        <slot name="topHeader"></slot>
    </v-toolbar>
    <!-- </div> -->
</div>
</template>

<script>
export default {
  props: {
    absolute: Boolean,
  },
}
</script>

<style src="../../static/styles/topHeader.scss" lang="scss" scoped>
</style>
