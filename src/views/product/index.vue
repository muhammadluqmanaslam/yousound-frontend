<template>
  <div class="page discover-page product-index-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Shop</h2>
          <ul class="pr-3">
            <li
              v-for="category in categories"
              :key="category.id"
              :class="{ active: isActiveCategory(category) }"
            >
              <label @click="filterByCategory(category)">{{
                category.name
              }}</label>
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
