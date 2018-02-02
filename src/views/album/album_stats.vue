<template>
  <v-layout row wrap class="page album-stats-page" v-if="album">
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="album-section">
      <h2 class="page-title">Stats</h2>
      <div class="album-info-section">
        <div class="album-cover-image" :style="{'background-image': 'url(' + album.cover.thumb.url + ')'}"></div>
        <div class="album-detail-section">
          <p class="album-name">{{ album.name }}</p>
          <p class="user-name">By <a :href="'/' + album.user.slug">{{ album.user.display_name }}</a></p>
        </div>
      </div>

    </v-flex>

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="normal-tab">
        <v-tabs black v-model="active">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              v-for="tab in tabs"
              :key="tab.id"
              :href="'#' + tab.id"
              ripple
            >
              {{ tab.title}}
            </v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content
              v-for="tab in tabs"
              :key="tab.id"
              :id="tab.id"
            >
              <v-card flat>
                <v-layout row wrap class="user-item">
                  <v-flex xs12 sm10 offset-sm1 class="user-item-body">
                    <v-layout row wrap class="">
                      <v-flex xs12 class="user-item-section" v-bind:class="{sm6: true}">
                        <v-flex xs12 class="user-item-section-body">
                          <div class="user-item-profile-avatar-area">
                            <img class="user-item-profile-avatar" src="/static/images/user2.jpg"/>
                          </div>
                          <div class="user-item-content-area">
                            <div class="user-item-content">
                              <a href="" class="user-name">DJ Soda</a>&nbsp;
                              <!-- <v-icon class="user-status online">fa-check-circle</v-icon>&nbsp; -->
                              <label class="follower-count"><strong>2.8k</strong> Followers</label>
                            </div>
                            <div class="actions-section">
                              <v-btn class="follow-btn">Follow</v-btn>
                              <v-menu offset-y class="more-menu">
                                <v-btn dark class="more-btn" slot="activator">
                                  <v-icon right>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile key="message">
                                    <v-list-tile-title class="default-menu-item">
                                      <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                                      <label>Message</label>
                                    </v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile key="blockuser">
                                    <v-list-tile-title class="default-menu-item">
                                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                                      <label>Block User</label>
                                    </v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </div>
                          </div>
                        </v-flex>
                      </v-flex>
                      <v-flex xs12 sm6 class="user-item-recent-posts" v-if="true">
                        <p class="recent-posts-section-title">Recent reposts</p>
                        <img class="recent-post-item" src="/static/images/post1.jpg" />
                        <img class="recent-post-item" src="/static/images/post3.jpg" />
                      </v-flex>
                    </v-layout>
                    <label class="following-time">10 min</label>
                  </v-flex>
                </v-layout>
                <v-layout row wrap class="user-item">
                  <v-flex xs12 sm10 offset-sm1 class="user-item-body last-item">
                    <v-layout row wrap>
                      <v-flex xs12 class="user-item-section no-reposts" v-bind:class="{sm6: false}">
                        <v-flex xs12 class="user-item-section-body">
                          <div class="user-item-profile-avatar-area">
                            <img class="user-item-profile-avatar" src="/static/images/user3.jpg"/>
                          </div>
                          <div class="user-item-content-area">
                            <div class="user-item-content">
                              <a href="" class="user-name">Johny Marr</a>&nbsp;
                              <v-icon class="user-status online">fa-check-circle</v-icon>&nbsp;
                              <!-- <v-icon class="item-status">fa-check-circle</v-icon> -->
                              <label class="follower-count"><strong>2.8k</strong> Followers</label>
                            </div>
                            <div class="actions-section">
                              <v-btn class="follow-btn">Follow</v-btn>
                              <v-menu offset-y class="more-menu">
                                <v-btn dark class="more-btn" slot="activator">
                                  <v-icon right>more_horiz</v-icon>
                                </v-btn>
                                <v-list>
                                  <v-list-tile key="message">
                                    <v-list-tile-title class="default-menu-item">
                                      <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                                      <label>Message</label>
                                    </v-list-tile-title>
                                  </v-list-tile>
                                  <v-list-tile key="blockuser">
                                    <v-list-tile-title class="default-menu-item">
                                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                                      <label>Block User</label>
                                    </v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </div>
                          </div>
                        </v-flex>
                      </v-flex>
                      <v-flex xs12 sm6 class="user-item-recent-posts" v-if="false">
                      </v-flex>
                    </v-layout>
                    <label class="following-time">10 min</label>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>
  </v-layout>
</template>
<script type="text/javascript" src="./album_stats.ctrl.js"></script>

