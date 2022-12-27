<template>
  <div class="tab-nav-wrapper">
    <div
      v-for="(tab, i) in tabData"
      :key="i"
      class="tab"
      :class="{ activeTab: tab.id == selectedTab }"
      @click="filterByCategory(tab)"
    >
      <v-chip
        class="_tchip text-capitalize"
        :class="{ '_rec-chip': recChip }"
      >
        {{ tab.title }}
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabData: Array,
    recChip: Boolean,
  },
  data() {
    return {
      selectedTab: "",
    };
  },
  methods: {
    updateSelectedTab(id) {
      // external fn called via refs
      this.selectedTab = id;
    },
    filterByCategory(tab) {
      console.log('clickr');
      this.selectedTab = tab.id
      this.$emit("tabClicked", tab);
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-nav-wrapper {
  display: flex;
  justify-content: space-between;
  overflow: auto;
  padding-right: 24px;
  margin-right: -24px;

  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }

  .tab {
    width: 100%;

    &:not(:last-child) {
      margin-right: 12px;
    }
    ._tchip {
      font-weight: 800;
      color: #000000;
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      background-color: transparent;
      border-radius: 90px;
      border: 1px solid #c4c4c4;

      &._rec-chip {
        border-radius: 3px;
      }
    }
    &.activeTab {
      ._tchip {
        border-radius: 90px;
        border: 1px solid #000000;
        background-color: #000000;
        color: #ffffff !important;

        &._rec-chip {
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
