<template>
  <div class="media" :class="type">
    <div class="media__image" :style="`background-image: url(${image})`"></div>
    <div class="media__content">
      <div>
        <div class="media__title">{{ title }}</div>
        <div class="media__description">{{ subtitle }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      image: String,
      title: String,
      subtitle: String,
      type: String
    }
  }
</script>

<style lang="scss" scoped>
.media {
  // display: flex;
  // padding: 4px 12px;

  &__image {
    // flex: 0 0 auto;
    display: inline-block;
    width: 64px;
    height: 64px;
    border-radius: 3.75px;
    background-size: cover;
    vertical-align: middle;
  }

  &__content {
    width: calc(100% - 80px);
    display: inline-block;
    padding-left: 11.25px;
    vertical-align: middle;
  }

  &__title {
    display: block;
    cursor: pointer;
    font-size: 15px;
    color: #000000;
    letter-spacing: -0.6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__subtitle {
    display: block;
    cursor: pointer;
    opacity: 0.5;
    font-size: 15px;
    color: #000000;
    letter-spacing: -0.6px;
  }
}

.media.user {
  .media__image {
    width: 55px;
    height: 55px;
    border-radius: 27.5px;
    background-size: cover;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    background-position: center;
    background-color: rgba(0, 0, 0, 0.1);
    // border: 0.75px solid rgba(0, 0, 0, 0.3);
  }

  .media__subtitle {
    padding-left: 10px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    color: #000000;
    letter-spacing: 0;
  }
}
</style>
