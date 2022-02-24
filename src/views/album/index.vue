<template>
  <div class="page albums-page mx-5" :class="{ isComp: isComp}">
    <discover-nav v-if="!isComp" pageName="music" />

    <content-top-header absolute class="__inner __doubleUl" :class="{'pl-0': isComp}">
      <template slot="topHeader">
        <ul>
          <li v-if="isComp">
            <h1>Music</h1>
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
            @click="$router.push({name: 'AlbumIndex'})"
          >
            View All
          </li>
        </ul>
        <ul v-if="!isComp" class="width100">
          <v-spacer></v-spacer>

          <li class="my-0">
            <v-menu
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              style="display: block"
              offset-y
            >
              <div slot="activator" class="genre-filter py-3">
                <span class="mr-3">Genre:</span>
                <span class="">{{ selectedGenreName }}</span>
                <v-icon right>keyboard_arrow_down</v-icon>
              </div>
              <v-list>
                <v-list-tile
                  v-for="genre in genres"
                  :key="genre.id"
                  @click.native="filterByGenre(genre)"
                >
                  <div class="cursor-pointer px-3">
                    {{ genre.name }}
                  </div>
                </v-list-tile>
              </v-list>
            </v-menu>
          </li>

          <li class="after-divider"></li>

          <li class="my-0 mr-2">
            <div
              class="genre-dialog-selector py-3"
              @mouseenter="hover_on_genre_button = true"
              @mouseleave="hover_on_genre_button = false"
              @click="openGenreSelectorDialog()"
            >
              <div class="genre-filter">
                <img src="/static/images/ic_filter.svg" />
              </div>
              <div v-show="showGenreTooltip" class="tooltip">
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">
                  Set your Genre Filters<br />
                  & customize your experience
                  <a @click.stop="got_genre_tooltip = true">Got it!</a>
                </div>
              </div>
            </div>
          </li>
        </ul>      
      </template>
    </content-top-header>


    <div class="page-content" v-if="currentUser">
      <v-layout row wrap>
        <v-flex
          v-for="(feed, index) in filtered_feeds"
          :key="index"
          class="card-container feed-card custom-lg5"
          xs12
        >
          <track-card
            :objects="filtered_feeds"
            :objectIndex="index"
            :hideButtonAction="hideAlbum"
          />
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
    </div>

    <v-dialog
      v-if="currentUser"
      v-model="show_genre_selector_dialog"
      content-class="my-genre-dialog ma-0 pa-2"
    >
      <genre-dialog :dismiss="closeGenreSelectorDialog" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<style lang="scss" scoped>
.vertical-divider {
  margin: 0px;
  font-size: 14px;
  background-color: #000000;
  border-left: 1px solid #000000;
}
.feed-card {
  // margin-left: -16px;
  // margin-right: 13px;
}
.top-menu {
  margin: 0 !important;

  .tabs__bar {
    .tabs__li {
      .tabs__item--active {
        .chip {
          background-color: #030303;
          color: #ffffff;
        }
      }
    }
  }

  .genre-dialog-selector {
    position: relative;
    width: 50px;
    display: flex;

    .genre-filter img {
      width: 20px;
      margin-top: 8px;
    }

    .tooltip {
      position: absolute;
      display: block;
      bottom: -63px;
      right: 48px;
      z-index: 9;
      width: 240px;
      padding: 0 0 10px 0;
      background-color: transparent;
      text-transform: initial;
      letter-spacing: -0.1px;
      .tooltip-arrow {
        position: absolute;
        top: -9px;
        right: -20px;
        width: 0;
        height: 0;
        margin: -2px;
        border-style: solid;
        // border-color: rgba(0, 0, 0, 0.2);
        border-color: #1e1e1e;
        border-width: 12px 12px 0;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        transform: rotate(180deg);
      }
      .tooltip-inner {
        position: relative;
        padding: 12px 12px 12px 12px;
        border-radius: 5px;
        // background-color: rgba(0, 0, 0, 0.2);
        background-color: #1e1e1e;
        color: #ffffff;
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
        width: 285px;
        margin-left: 12px;
        padding-left: 15px;
        a {
          position: absolute;
          top: 15px;
          right: 10px;
          padding: 5px 7px;
          border-radius: 5px;
          background-color: #4389f7;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
