<template>
  <div class="autocomplete">
    <div v-if="options.length && showPanel" class="options">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
        @click="selectOption(option)"
      >
        {{ itemName ? option[itemName] : option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyword: [String, Number],
    options: Array,
    identifier: String,
    itemName: String,
  },
  data() {
    return {
      current: null,
      showPanel: false,
    };
  },
  watch: {
    options(val) {
      if (val.length) {
        this.setCurrent();
      }
    },
    keyword() {
      this.showPanel = true;
    },
    showPanel(val) {
      console.log(val)
    },
  },
  methods: {
    selectOption(option) {
      // Bug: had to combine bothe false instance
      this.showPanel = false;
      this.$nextTick(() => {
        this.showPanel = false;
      })

      this.$emit("selected", this.identifier, option);
    },
    setCurrent() {
      if (this.options.length) {
        this.current = this.options[0];
      }
    },
  },
  destroyed() {
    this.showPanel = false
  },
};
</script>

<style lang="scss" scoped>
.autocomplete {
  position: absolute;
  width: 100%;
  z-index: 10;

  .options {
    max-height: 100px;
    overflow: auto;
    background-color: #eaeaea;

    .option {
      padding: 10px 5px;

      &:hover {
        color: #ffffff;
        background-color: #000000;
      }
    }
  }
}
</style>
