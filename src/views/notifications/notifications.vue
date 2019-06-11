<template>
  <div class="page notifications-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Activity</h2>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="tab-container">
        <v-tabs dark v-model="active_tab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              v-for="tab in tabs"
              :key="tab.id"
              :href="'#' + tab.id"
              @click.native="onTab(tab.id)"
              ripple
            >{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
              <template v-if="isPageReady">
                <div v-if="!filtered_activities || filtered_activities.length == 0" class="empty-section">
                  <p class="empty-title">No Activity</p>
                  <p class="empty-description">This is where you'll see who followed, commented, and other activity.</p>
                  <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                </div>
                <template v-else>
                  <activity-item
                    v-for="(activity, index) in filtered_activities"
                    :key="index"
                    :activityItem="activity"
                  />
                  <div class="text-xs-center">
                    <v-btn
                      v-if="page_index < total_pages"
                      @click.native="loadMore()"
                      class="loadmore-btn"
                    >Load More</v-btn>
                  </div>
                </template>
              </template>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>

    <!-- <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="notifications-page-header">
      <v-flex xs12>
        <v-layout row wrap>
          <h2 class="page-title">Activity</h2>
          <v-spacer></v-spacer>
          <v-menu offset-y mt-2 id="filter_selector">
            <v-btn dark slot="activator">All Activity
              <v-icon right>keyboard_arrow_down</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(filter, index) in filters" :key="filter.id" @click.native="filterSelected(index)">
                <v-list-tile-title>{{ filter.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-layout>
      </v-flex>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="notifications-page-content" v-if="isPageReady">
      <div v-if="!filtered_activities || filtered_activities.length == 0" class="empty-section">
        <p class="empty-title">No Activity</p>
        <p class="empty-description">This is where you'll see who followed, commented, and other activity.</p>
        <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
      </div>
      <template v-else>
        <activity-item v-for="(activity, index) in filtered_activities" :key="index" :activityItem="activity"></activity-item>
        <div class="text-xs-center">
          <v-btn class="loadmore-btn" @click.native="loadMore()" v-show="page_index < total_pages">Load More</v-btn>
        </div>
      </template>
    </v-flex> -->
  </div>
</template>

<script type="text/javascript" src="./notifications.ctrl.js"></script>
