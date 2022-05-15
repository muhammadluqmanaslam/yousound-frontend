<template>
  <div class="tab-nav-wrapper">
    <div
      v-for="(tab, i) in tabData"
      :key="i"
      class="tab"
      :class="{ activeTab: tab.id == selectedTab }"
      @click="selectedTab = tab.id"
    >
      <v-chip
        class="_tchip text-capitalize"
        :class="{ '_rec-chip': recChip }"
        @click="filterByCategory(tab)"
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
    centered: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedTab: "",
    };
  },
  methods: {
    filterByCategory(tab) {
      this.$emit("tabClicked", tab);
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-nav-wrapper {
    display: flex;
    justify-content: space-between;

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
