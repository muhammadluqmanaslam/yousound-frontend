<template>
  <div class="pane-tabs-onMobil pane-tabs-main">
    <div
      v-for="(tab, index) in paneTabs"
      :key="index"
      class="pane-tab"
      :class="{active: activePaneTab == tab.id}"
      :style="`width: ${100/paneTabs.length}%`"
      @click="selectPane(tab)"
      >
        <img v-if="tab.icon" :src="tab.icon" alt="pane tab icon" class="pane-tab-img">
        <span>{{ tab.title }}</span>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    paneTabs: {
      Array,
      required: true,
    },
    initSelected: String,
  },
  data() {
    return {
      activePaneTab: '',
    }
  },
  methods: {
    selectPane(tab) {
      this.activePaneTab= tab.id
      this.$emit("tabClicked", tab);
    },
  },
  created() {
    if(this.initSelected) {
        this.activePaneTab = this.initSelected
    }
  },
}
</script>

<style>

</style>