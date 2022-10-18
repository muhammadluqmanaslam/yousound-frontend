<template>
  <div class="page video-page index-page" :class="{isComp}">
    <discover-nav v-if="!isComp && !onMobile" pageName="video" />

    <content-top-header
      v-if="isPageReady"
      absolute
      class="__inner __doubleUl" height="35"
      :class="{'px-5': !isComp, 'pl-0': isComp}"
    >
      <template slot="topHeader">
        <ul :class="{'mr-3': !isComp}">
          <li v-if="isComp">
            <h1>Video</h1>
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
            @click="$router.push({name: 'VideoIndex'})"
          >
            View All
          </li>
        </ul>

        <ul v-if="!isComp && !onMobile" class="ml-5">
          <v-spacer></v-spacer>
          <li class="my-2">
            <v-menu
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              style="display: block"
              offset-y
            >
              <div slot="activator" class="genre-filter py-3">
                <span class="mr-3">Genre:</span>
                <span class="">{{ selected_genre.name }}</span>
                <v-icon right>keyboard_arrow_down</v-icon>
              </div>
              <v-list>
                <v-list-tile
                  v-for="genre in available_genres"
                  :key="genre.id"
                  @click.native="setTab(genre.id)"
                >
                  <div class="cursor-pointer px-3">
                    {{ genre.name }}
                  </div>
                </v-list-tile>
              </v-list>
            </v-menu>

            <!-- <v-tabs :scrollable="true">
              <v-tabs-bar>
                <v-tabs-item
                  v-model="selectedTab"
                  v-for="(genre, idx) in available_genres"
                  :key="idx"
                  :href="'#tab-' + idx"
                >
                  <v-chip class="text-capitalize" @click.native="setTab(genre.id)">
                    {{ genre.name.toLowerCase() }}
                  </v-chip>
                </v-tabs-item>
              </v-tabs-bar>
            </v-tabs> -->
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content">
      <v-container fluid :grid-list-md="onMobile" px-0 pt-0>
        <v-layout row wrap>
          <!-- <v-flex xs4 v-for="(video, i) in videos" :key="i" class="video-container top-3"> -->
          <v-flex 
            v-for="(video) in videos.slice(0,3)" 
            :key="video.name"
            class="video-container"
            :class="[!isComp ? 'video-container top-3 xs12 sm4' : 'pl-0 xs4', {side_fullwidth: onMobile}]"
          >
            <video-box class="_sliced-top" :hoverOverlay="false" :item="video" />
          </v-flex>

          <v-flex
            xs4
            v-for="(video) in videos.slice(3,videos.length)"
            :key="video.name" 
            :class="[!isComp ? 'card-container top-3 xs12 sm4' : 'video-container pl-0 xs4', {side_fullwidth: onMobile}]"
          >
            <video-box :hoverOverlay="false" :item="video" />
          </v-flex>
        </v-layout>
      </v-container>

      <div v-if="!isComp" class="text-xs-center">
        <v-btn
          v-if="isPageReady"
          v-show="pagination.current_page < pagination.total_pages"
          @click.native="loadMore()"
          class="loadmore-btn"
          >Load More</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script src="./index.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
.top-menu {
    margin: 0 !important;
}
.tabs__bar {
    width: calc(100% + 72px);
    position: relative;
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
