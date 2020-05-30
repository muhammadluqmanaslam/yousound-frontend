<template>
  <div class="media">
    <div
      class="media__image"
      :class="{'round': imageRounded }"
      :style="`background-image: url(${image})`"
    ></div>
    <div class="media__content">
      <div>
        <div class="media__title">
          {{ title }}
          <v-icon v-if="meta.verified">fa-check-circle</v-icon>
        </div>
        <div class="media__subtitle" v-if="subtitle">{{ subtitle }}</div>
        <div class="media__description" v-if="description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      image: String,
      roundImage: Boolean,
      title: String,
      subtitle: String,
      description: String,
      meta: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    computed: {
      imageRounded () {
        return this._.get(this.meta, 'type') === 'user'
      }
    }
  }
</script>

<style lang="scss" scoped>
.media {
  display: flex;

  &__image {
    flex: 0 0 auto;
    width: 60px;
    height: 60px;
    margin: 0 10px;
    border-radius: 3.75px;
    background-size: cover;

    &.round {
      border-radius: 30px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__title {
    display: block;
    overflow: hidden;
    color: #000000;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.6px;
    white-space: nowrap;
    text-overflow: ellipsis;

    i {
      color: #32cd32;
      font-size: 14px;
      vertical-align: top;
    }
  }

  &__subtitle,
  &__description {
    display: block;
    color: #808080;
    font-size: 14px;
    //letter-spacing: -0.6px;
  }
}
</style>
