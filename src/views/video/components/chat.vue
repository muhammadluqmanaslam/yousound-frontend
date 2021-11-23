<template>
  <div class="items">
    <template v-for="item in items">
      <div class="item" :key="item.id">
        <div class="item__header">
          <router-link :to="`/${item.user.slug}`">
            <div
              class="item__image"
              :style="`background-image: url(${item.user.avatar.url})`"
            ></div>
          </router-link>
        </div>
        <div class="item__content">
          <div class="item__title">
            <router-link :to="`/${item.user.slug}`">
              {{ item.user.username }}
            </router-link>
            <span>{{ toLocalTimeString(item.created_at) }}</span>
          </div>
          <div class="item__description" v-html="item.body"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { Utils } from "@/helper";

export default {
  props: {
    items: Array,
  },

  data() {
    return {
      toLocalTimeString: Utils.toLocalTimeString,
    };
  },
};
</script>

<style lang="scss" scoped>
.items {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.item {
  display: flex;
  min-height: 55px;

  &__header {
    width: 55px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  &__title {
    font-weight: 700;
    span {
      font-size: 12px;
      color: #ccc;
    }
  }
}
</style>
