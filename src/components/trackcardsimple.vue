<template>
  <div class="track-card-simple">
    <div
      class="cover"
      :style="`background-image: url(${cover}); height: ${height}px; width: ${width}px`"
    ></div>
    <div class="details">
      <div class="title">{{ title }}</div>
      <div class="subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    width: {
      type: [String, Number],
      default: 70,
    },
    height: {
      type: [String, Number],
      default: 70,
    },
    cover: String,
    title: String,
    subtitle: String,
  },
};
</script>

<style lang="scss" scoped>
.track-card-simple {
  display: flex;
  align-items: center;

  .cover {
    margin-right: 15px;
    background-size: cover;
    background-position: center;
  }
  .details {
    .title {
      font-weight: 600;
    }
    .subtitle {
      text-transform: capitalize;
      font-weight: 500;
    }
  }
}
</style>
