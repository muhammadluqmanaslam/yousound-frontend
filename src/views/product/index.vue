<template>
  <div class="page discover-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Shop</h2>
          <ul class="pr-3">
            <!-- <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="isPageReady && onTab(tab.id)">{{
                tab.title
              }}</label>
            </li> -->

            <li class="border-top border-bottom my-0">
              <v-menu
                id="category_selector"
                class="filter_menu"
                style="display: block"
                offset-y
              >
                <!-- <v-btn dark slot="activator">Any category
                  <v-icon dark right>keyboard_arrow_down</v-icon>
                </v-btn> -->
                <div slot="activator" class="genre-filter py-3">
                  <span>{{ selectedCategoryName }}</span>
                  <v-icon right>keyboard_arrow_down</v-icon>
                </div>
                <v-list>
                  <v-list-tile
                    v-for="category in categories"
                    :key="category.id"
                    @click.native="filterByCategory(category)"
                  >
                    <v-list-tile-title>{{ category.name }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </li>
          </ul>
        </div>
      </div>

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

<style lang="scss" scoped></style>
