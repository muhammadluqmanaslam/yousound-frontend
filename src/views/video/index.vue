<template>
  <div class="page video-page index-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Video</h2>
          <h4 class="page-subtitle">
            Live broadcasts from artists & brands you follow
          </h4>
          <ul class="pr-3">
            <li class="border-top border-bottom my-0">
              <v-menu
                content-class="filter-menu__content"
                id="genre_selector"
                class="filter_menu"
                style="display: block;"
                offset-y
              >
                <!-- <v-btn dark slot="activator">Any genre
                  <v-icon dark right>keyboard_arrow_down</v-icon>
                </v-btn> -->
                <div slot="activator" class="genre-filter py-3">
                  <span>{{ _.get(selected_genre, 'name', '') }}</span>
                  <v-icon right>keyboard_arrow_down</v-icon>
                </div>
                <v-list>
                  <v-list-tile
                    v-for="genre in available_genres"
                    :key="genre.id"
                    @click.native="setTab(genre.id)"
                  >
                    <v-list-tile-title>{{ genre.name }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </li>
            <!-- <li
              v-for="genre in available_genres"
              :key="genre.id"
              :href="`#${genre.id}`"
              :class="{ 'active': activeTab == genre.id }"
            ><label @click="setTab(genre.id)">{{ genre.name }}</label></li> -->
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser">
        <v-layout row wrap>
          <div v-for="video in videos" :key="video.id" class="card-container">
            <video-box :item="video" />
          </div>
        </v-layout>

        <div class="text-xs-center">
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
  </div>
</template>

<script src="./index.ctrl.js"></script>
