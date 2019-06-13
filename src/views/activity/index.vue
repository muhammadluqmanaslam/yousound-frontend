<template>
  <div class="page activity-page">
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
                <div v-if="!activities || activities.length == 0" class="empty-section">
                  <p class="empty-title">No Activity</p>
                  <p class="empty-description">This is where you'll see who followed, commented, and other activity.</p>
                  <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                </div>
                <template v-else>
                  <activity-item
                    v-for="(activity, index) in activities"
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
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
