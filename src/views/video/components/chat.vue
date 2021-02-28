<template>
  <div>
    <div class="box__title">Join the conversation</div>
    <div class="box__content">
      <div class="items">
        <template v-for="item in items">
          <div class="item" :key="item.id">
            <div class="item__header">Avatar</div>
            <div class="item__content">
              <div class="item__title">Ethan Stoll <span>1 year ago</span></div>
              <div class="item__description"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="box__footer">
      <input type="text" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
  },
}
</script>

<style lang="scss" scoped></style>
