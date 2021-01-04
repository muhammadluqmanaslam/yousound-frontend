<template>
  <div class="tag">
    {{ user.display_name }}
    <v-icon
      v-if="['artist', 'label', 'brand'].indexOf(user.user_type) > -1"
      class="user-status online"
      >fa-check-circle</v-icon
    >
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
  },
}
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  font-weight: 700;

  i {
    margin-left: -4px;
    vertical-align: super;
    font-size: 0.8rem;
    color: #31bb25;
  }
}
</style>
