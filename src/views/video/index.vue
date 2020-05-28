<template>
  <div class="page video-page video-index-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Video</h2>
          <ul class="pr-3">
            <li
              v-for="genre in available_genres"
              :key="genre.id"
              :href="`#${genre.id}`"
              :class="{ 'active': activeTab == genre.id }"
            ><label @click="setTab(genre.id)">{{ genre.name }}</label></li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser">
        <v-layout row wrap>
          <div
            v-for="video in videos"
            :key="video.id"
            class="card-container"
          >
            <video-box :item="video"/>
          </div>
        </v-layout>


        <div class="text-xs-center">
          <v-btn
            v-if="isPageReady"
            v-show="pagination.current_page < pagination.total_pages"
            @click.native="loadMore()"
            class="loadmore-btn"
          >Load More</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.ctrl.js"></script>
