<template>
  <div class="tab-nav-wrapper">
      <v-tabs v-model="selectedTab" centered show-arrows grow>
        <!-- <v-tabs-slider color="yellow"></v-tabs-slider> -->
        <v-tabs-bar style="margin-left: 0">
        <v-tabs-item
            v-for="(tab, i) in tabData"
            :key="i"
            :href="`#${tab.id}`"
            active-class="activeTab"
        >
            <v-chip 
                class="_tchip text-capitalize"
                :class="{'_rec-chip': recChip}"
                @click="filterByCategory(tab)"
            >
                {{ tab.title }}
            </v-chip>
        </v-tabs-item>
        </v-tabs-bar>
    </v-tabs>
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
            selectedTab: '',
        }
    },
    methods: {
        filterByCategory(tab) {
            this.$emit('tabClicked', tab)
        }
    },
}
</script>

<style lang="scss" scoped>
.tabs__li {
    /deep/.tabs__item {
        opacity: 1 !important;
        padding-left: 0;
        padding-right: 0;

        ._tchip {
            font-weight: 800;
            color: #000;
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
        &.tabs__item--active {
            color: #000000;
        }
    }
}
</style>
