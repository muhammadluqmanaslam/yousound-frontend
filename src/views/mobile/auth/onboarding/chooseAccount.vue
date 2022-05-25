<template>
  <div class="choose-account">
    <div
      class="account _listener"
      :class="{ onSelect: selected == 'listener' }"
      @click="chooseAccount('listener')"
    >
      <div class="title">Listener</div>
      <div class="subtitle">I want to stream & watch</div>
    </div>

    <div
      class="account _creator"
      :class="{ onSelect: selected == 'creator' }"
      @click="chooseAccount('creator')"
    >
      <div class="_title">Creator</div>
      <div class="_subtitle">I want to upload & sell</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
    };
  },
  computed: {
    validate() {
      const { selected } = this;
      const toVaidate = [selected];

      const isValid = toVaidate.every((item) => item);
      return isValid;
    },
  },
  methods: {
    chooseAccount(accountType) {
      this.selected = accountType;

      if (this.validate)
        return this.$emit("nextStage", { accountType, completedStage: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  border: 1px solid #d0d0d0;
  border-radius: 12px;
  padding: 15px 20px;
  text-align: center;
  cursor: pointer;

  &.onSelect {
    background-color: #000000;
    color: #ffffff;
  }

  &._listener {
    margin-bottom: 12px;
  }

  ._title {
    font-size: 25px;
    font-weight: 700;
  }
  ._subtitle {
    font-size: 14px;
    font-weight: 500;
    color: rbga(0, 0, 0, 0.7);
  }
}
</style>
