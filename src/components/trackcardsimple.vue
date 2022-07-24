<template>
  <div class="track-card-simple">
    <div
      class="cover"
      :class="{round, coverRadius}"
      :style="`background-image: url(${cover}); height: ${height}px; width: ${width}px`"
    ></div>
    <div class="details">
      <div class="_title">{{ title }}</div>
      <div class="_subtitle">{{ subtitle }}</div>
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
    coverRadius: Boolean,
    round: Boolean,
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

    &.coverRadius {
      border-radius: 10px;
    }
    &.round {
      border-radius: 500px;
    }
  }
  .details {
    ._title {
      font-weight: 600;
    }
    ._subtitle {
      text-transform: capitalize;
      font-weight: 500;
    }
  }
}
</style>
