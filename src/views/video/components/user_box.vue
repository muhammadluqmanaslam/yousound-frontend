<template>
  <div class="box">
    <div class="box__content">
      <div class="box__image"></div>
    </div>
    <div class="box__footer">
      <div class="box__title">
        <user-tag :user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import UserTag from '@/components/user_tag'

export default {
  components: {
    UserTag,
  },

  props: {
    user: Object,
  },
}
</script>

<style lang="scss" scoped>
.box {
  &__content {
    position: relative;
    width: 100%;
  }

  &__footer {
  }

  &__image {
    z-index: 1;
    width: 100%;
    padding-bottom: 100%;
    background-size: cover;
    overflow: hidden;
    background-position: center;
    border-radius: 50%;
    border: none;
  }

  &__title,
  &__subtitle {
    display: block;
    overflow: hidden;
    letter-spacing: -0.6px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__subtitle {
    color: #333;
    font-size: 14px;
    font-weight: 700;
    a {
      color: #000000;
    }
  }

  &__title {
    margin-top: 10px;
    color: #000000;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
