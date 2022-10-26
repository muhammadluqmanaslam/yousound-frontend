<template>
  <div class="top-menu margin-top-header">
    <v-toolbar app :fixed="!absolute" :flat="absolute" class="tab-container" :class="{__absolute: absolute}" :height="height">
        <!-- ancestoral element to all top headers -->
        <slot name="topHeader"></slot>
    </v-toolbar>
</div>
</template>

<script>
export default {
  props: {
    absolute: Boolean,
    height: {
      default: 73,
    },
  },
}
</script>

<style src="../../static/styles/topHeader.scss" lang="scss" scoped>
</style>
