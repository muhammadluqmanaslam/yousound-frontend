<template>
  <div class="page stream-page">
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Stream</h2>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="stream-tab">
        <v-tabs dark v-model="activeTab">
          <v-tabs-bar class="transparent">
            <v-tabs-item v-for="tab in tabs"
              :key="tab.id"
              :href="'#' + tab.id"
              @click.native="onTab(tab.id)"
              ripple>{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
              <template v-if="isPageReady">
                <div v-if="!users || users.length == 0" class="empty-section">
                  <p class="empty-title">Your stream is empty</p>
                  <p class="empty-description">Follow people to discover new music &amp; merch.</p>
                  <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                </div>
                <div v-else-if="activeTab == tab.id" v-for="(user, user_index) in users" :key="user_index">
                  <v-layout row wrap class="covers-content">
                    <stream-user :user="user"></stream-user>
                  </v-layout>

                  <div class="text-xs-center">
                    <v-btn class="loadmore-btn" @click.native="loadMore()" v-show="page_index < total_pages">Load More</v-btn>
                  </div>
                </div>
              </template>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./stream.ctrl.js"></script>
