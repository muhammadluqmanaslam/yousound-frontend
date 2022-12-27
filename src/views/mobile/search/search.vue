<template>
  <transition name="slide-up">
    <div class="page search-page mx-5">
      <search-input class="mb-2" isOnMobile />
      <tab-nav :tabData="refactoredTabs" ref="tabData" @tabClicked="onTab" />

      <v-container grid-list-md fluid page-content px-0>
        <v-layout v-if="active_tab == 'albums'" row wrap class="covers-content">
          <v-flex
            v-for="(feed, index) in result.albums"
            :key="`album-${feed.id}`"
            xs6
          >
            <track-card
              :objects="result.albums"
              :objectIndex="index"
            ></track-card>
          </v-flex>
        </v-layout>

        <v-layout
          v-if="active_tab == 'products'"
          row
          wrap
          class="covers-content"
        >
          <v-flex v-for="(feed, index) in result.products" :key="index" xs6>
            <product-card :dataObject="feed"></product-card>
          </v-flex>
        </v-layout>

        <v-layout
          v-if="active_tab == 'live_videos'"
          row
          wrap
          class="covers-content"
        >
          <div v-for="(feed, index) in result.streams" :key="index" xs3>
            <video-box :item="feed" />
          </div>
        </v-layout>

        <v-layout v-if="active_tab == 'users'" row wrap class="covers-content">
          <v-flex v-for="user in result.users" :key="`user-${user.id}`" xs6>
            <artist-item :artist="user"></artist-item>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </transition>
</template>

<script type="text/javascript" src="../../../views/search/search.ctrl.js"></script>
