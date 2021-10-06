<template>
  <div class="page discover-page product-index-page mx-5">
    <content-top-header>
      <template slot="topHeader">
        <v-tabs :scrollable="true">
          <v-tabs-bar>
            <v-tabs-item
              v-model="selectedTab"
              v-for="(category, i) in categories"
              :key="i"
              :href="'#tab-' + i"
            >
              <v-chip class="text-capitalize" @click="filterByCategory(category)">
                {{ category.name }}
              </v-chip>
            </v-tabs-item>
          </v-tabs-bar>
        </v-tabs>
        </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content" v-if="currentUser">
        <v-layout row wrap>
          <div v-for="feed in products" :key="feed.id" class="card-container">
            <product-card :dataObject="feed" />
          </div>
        </v-layout>

        <div class="text-xs-center">
          <v-btn
            v-if="isPageReady"
            v-show="page_index < total_pages"
            @click.native="loadMore()"
            class="loadmore-btn"
            >Load More</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style lang="scss" scoped>
.tabs__bar {
    width: calc(100% + 72px);
    position: relative;
    // left: -41px;
    .tabs__li {
      margin: 0 !important;
      .tabs__item--active {
        .chip {
          background-color: #030303;
          color: #ffffff;
        }
      }
    }

}
</style>
