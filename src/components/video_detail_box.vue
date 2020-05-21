<template>
  <div class="box">
    <div class="box__header">
      <div class="box__caption">Live</div>
      <label>{{ item.started_at | formatDateFromNow }}</label>
    </div>
    <div class="box__content">
      <div class="box__title">{{ _.get(item, 'user.display_name') }}</div>
      <div class="box__subtitle">{{ item.name }}</div>
      <label>{{ _.get(item, 'genre.name') }}</label>
    </div>
    <div class="box__footer" v-if="item.view_price > 0">
      <!-- <v-btn block dark>Pay ${{ item.view_price | formatNumber }}</v-btn> -->
      <v-btn
        dark block
        :to="`/${_.get(item, 'user.slug')}`"
      >Watch</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: Object
    },

    methods: {

    }
  }
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;

  &__header,
  &__content,
  &__footer {
    width: 100%;
    text-align: center;
  }

  &__header {
    margin-top: 15px;
  }

  &__footer {
    padding: 0px 10px 15px 10px;
  }

  label {
    display: block;
    color: #888;
  }

  .btn {
    margin: 0;
    border-radius: 3.75px;
    background-color: #0074ff !important;
    text-transform: initial;
    font-weight: 700;
    letter-spacing: 0.6px;
  }

  &__caption {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 3.75px;
    background-color: #ff0042;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2.6px;
    text-transform: uppercase;
  }

  &__title,
  &__subtitle {
    display: block;
    overflow: hidden;
    color: #000000;
    letter-spacing: -0.6px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
  }

  &__subtitle {
    font-size: 14px;
    font-weight: 300;
  }

  &__content:hover {
    box__overlay {
      display: block;
    }
  }
}
</style>
