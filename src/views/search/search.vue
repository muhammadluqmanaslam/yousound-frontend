<template>
  <div class="page search-page mx-5">
    <content-top-header class="black-theme">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in refactoredTabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)">
              {{ tab.title }}
            </label>
          </li>

          <v-spacer></v-spacer>

          <li class="search-li">
            <div class="dflex align-center justify-end">
              <div>
                <search-input theme="dark"/>
              </div>

              <div class="ml-3 pos-relative">
                <img src="../../assets/gear-icon.svg" width="20" class="cursor-pointer" @click="(showAdvnacedSearch = ! showAdvnacedSearch)">

                <div class="advanced-search" v-if="showAdvnacedSearch">
                  <div class="big-head">Advanced Search</div>
                  <div class="divider my-4"></div>

                  <div>
                    <div class="small-head mb-2">Keywords</div>
                    <input type="text" class="main-input">
                  </div>
                  <div class="mt-3">
                    <div class="small-head mb-2">Genre</div>
                    <select  class="main-input">
                      <option disabled>Select</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>

                  <div class="dflex mt-3 gap-10 align-end">
                    <div class="w-full">
                      <div class="small-head mb-2">BPM</div>
                      <input type="text" class="main-input">
                    </div>
                    <div class="w-full">
                      <div class="small-head mb-2">KEY</div>
                      <select  class="main-input">
                        <option >Select</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    <div class="w-full">
                      <select  class="main-input">
                        <option >-</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-3">
                    <div class="small-head mb-2">Release year</div>
                    <input type="text" class="main-input" placeholder="'1970'">
                  </div>

                  <div class="mt-3">
                    <div class="small-head mb-2">Location</div>
                    <input type="text" class="main-input" placeholder="Start typing">
                  </div>

                  <div class="mt-3">
                   <v-btn class="search-button-x">
                    Search
                   </v-btn>
                  </div>
                </div>
              </div>

            </div>
          </li>
        </ul>
      </template>
    </content-top-header>

    <v-container grid-list-lg fluid page-content px-0>
      <v-layout v-if="active_tab == 'albums'" row wrap class="albums_result covers-content">
        <v-flex
          v-for="(feed, index) in result.albums"
          :key="`album-${feed.id}`"
          class="custom-lg5 px-0"
          xs12
        >
          <track-card
            :objects="result.albums"
            :objectIndex="index"
          ></track-card>
        </v-flex>
      </v-layout>

      <!-- <div v-if="active_tab == 'playlists'">
        <v-layout row wrap class="covers-content">
          <div
            v-for="(feed, index) in result.playlists"
            :key="`playlist-${feed.id}`"
            class="card-container"
          >
            <track-card
              :objects="result.playlists"
              :objectIndex="index"
            ></track-card>
          </div>
        </v-layout>
      </div> -->

      <v-layout v-if="active_tab == 'products'" row wrap class="products_result covers-content">
        <v-flex
          v-for="(feed, index) in result.products"
          :key="`product-${feed.id}`"
          class="card-container"
        >
          <product-card :dataObject="feed"></product-card>
        </v-flex>
      </v-layout>

      <v-layout v-if="active_tab == 'live_videos'" row wrap class="videos_result covers-content">
        <div
          v-for="(feed, index) in result.streams"
          :key="`video-${feed.id}`"
          class="card-container"
          xs3
        >
          <video-box :item="feed" />
        </div>
      </v-layout>

      <v-layout v-if="active_tab == 'users'" row wrap class="covers-content">
        <v-flex
          v-for="user in result.users"
          :key="`user-${user.id}`"
          class="card-container"
          xs2
        >
          <artist-item :artist="user"></artist-item>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./search.ctrl.js"></script>
