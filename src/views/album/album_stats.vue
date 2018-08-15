<template>
  <div class="page album-stats-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="album-section" v-if="isPageReady">
      <h2 class="page-title">Stats</h2>
      <div class="album-info-section">
        <div class="album-cover-image" :style="{'background-image': 'url(' + album.cover.thumb.url + ')'}"></div>
        <div class="album-detail-section">
          <p class="album-name">{{ album.name }}</p>
          <p class="user-name">By <router-link :to="'/' + album.user.slug">{{ album.user.display_name }}</router-link></p>
          <p class="album-stats">
            <span>{{ album.stats.reposts_size | formatLargeNumber }}</span><label>Reposts</label>
            <span>{{ album.stats.downloads_size | formatLargeNumber }}</span><label>Downloads</label>
            <span>{{ album.stats.plays_size | formatLargeNumber }}</span><label>Plays</label>
            <span>{{ album.stats.hides_size | formatLargeNumber }}</span><label>Hides</label>
          </p>
        </div>
      </div>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="normal-tab">
        <v-tabs black v-model="currentTab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              @click.native="onTab(tab.id)"
              ripple>{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content
              v-for="tab in tabs"
              :key="tab.id"
              :id="tab.id">
              <v-card flat>
                <activity-item v-for="activity in activities" :key="activity.id" :activityItem="activity"></activity-item>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./album_stats.ctrl.js"></script>
