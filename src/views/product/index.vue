<template>
  <div class="page discover-page product-index-page mx-5" :class="{ isComp: isComp}">
    <discover-nav v-if="!isComp && !onMobile" pageName="merch" />

    <content-top-header absolute v-if="onMobile" height="35" :class="{ isOnMobile: onMobile}">
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

    <content-top-header absolute class="__inner __doubleUl ma-0 px-0">
      <template slot="topHeader">
        <ul>
          <li v-if="isComp">
            <h1>Shop</h1>
          </li>
          <template v-if="!isComp">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="isPageReady && onTab(tab.id)">{{ tab.title }}</label>
            </li>
          </template>

          <v-spacer v-if="isComp"></v-spacer>

          <li
            v-if="isComp" 
            class="cursor-pointer"
            @click="$router.push({name: 'ProductIndex'})"
          >
            View All
          </li>
        </ul>

        <ul v-if="!isComp && !onMobile" class="mx-3">
          <v-spacer></v-spacer>

          <li class="">
            <v-menu
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              style="display: block"
              offset-y
            >
              <div slot="activator" class="genre-filter py-3">
                <span class="mr-3">Category:</span>
                <span class="">{{ selectedTab | capitalize }}</span>
                <v-icon right>keyboard_arrow_down</v-icon>
              </div>
              <v-list>
                <v-list-tile
                  v-for="category in categories"
                  :key="category.id"
                  @click.native="filterByCategory(category)"
                >
                  <div class="cursor-pointer px-3">
                    {{ category.name }}
                  </div>
                </v-list-tile>
              </v-list>
            </v-menu>
            <!-- <v-tabs :scrollable="true">
              <v-tabs-bar style="margin-left: 0">
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
            </v-tabs> -->
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content" v-if="currentUser">
        <v-container fluid grid-list-md pl-0 style="margin-left: -10px">
          <v-layout row wrap>
            <v-flex xs6 sm4 lg3 v-for="feed in products" :key="feed.id">
              <!-- <product-card :hideOverlay="true" :dataObject="feed" /> -->
              <product-card
               hideOverlay 
              :noMeta="onMobile ? true : false" 
              :altMeta="onMobile ? true : false" 
              :altMetaPrice="onMobile ? true : false" 
              :dataObject="feed" />
            </v-flex>
          </v-layout>

          <div v-if="!isComp" class="text-xs-center">
            <v-btn
              v-if="isPageReady"
              v-show="page_index < total_pages"
              @click.native="loadMore()"
              class="loadmore-btn"
              >Load More</v-btn
            >
          </div>
        </v-container>
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
