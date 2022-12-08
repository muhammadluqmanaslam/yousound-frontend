<template>
  <div class="page admin-page">
    <v-flex xs12 sm12 px-4>
      <div class="admin-tab mt-4">
        <v-tabs dark center-active>
          <content-top-header class="black-theme for-tabs">
            <template slot="topHeader">
              <v-tabs-bar class="tab_bar" dark>
                <div
                class="active-icon"
                >Admin >
                </div
              >
                <v-tabs-item
                  v-for="tab in tabs"
                  v-if="availableTab(tab)"
                  :key="tab.id"
                  :href="'#' + tab.id"
                  @click.native="onTab(tab.id)"
                  ripple
                  >{{ tab.title }}</v-tabs-item
                >
                <!-- <v-tabs-slider color="white"></v-tabs-slider> -->
              </v-tabs-bar>
            </template>
          </content-top-header>

          <v-tabs-items>
            <v-tabs-content key="users" id="users">
              <user-tab
                v-if="$store.state.navigator.current.tab == 'users'"
              ></user-tab>
            </v-tabs-content>

            <v-tabs-content key="albums" id="albums">
              <album-tab
                v-if="$store.state.navigator.current.tab == 'albums'"
              ></album-tab>
            </v-tabs-content>

            <v-tabs-content key="signups" id="signups">
              <signup-tab
                v-if="$store.state.navigator.current.tab == 'signups'"
              ></signup-tab>
            </v-tabs-content>

            <v-tabs-content key="subscriptions" id="subscriptions">
              <subscription-tab
                v-if="$store.state.navigator.current.tab == 'subscriptions'"
              ></subscription-tab>
            </v-tabs-content>

            <v-tabs-content id="payments">
              <payment-tab
                v-if="$store.state.navigator.current.tab == 'payments'"
              ></payment-tab>
            </v-tabs-content>

            <v-tabs-content key="genres" id="genres">
              <genre-tab
                v-if="$store.state.navigator.current.tab == 'genres'"
              ></genre-tab>
            </v-tabs-content>

            <v-tabs-content key="settings" id="settings">
              <setting-tab
                v-if="$store.state.navigator.current.tab == 'settings'"
              ></setting-tab>
            </v-tabs-content>

            <v-tabs-content key="globalstats" id="globalstats">
              <globalstats-tab
                v-if="$store.state.navigator.current.tab == 'globalstats'"
              ></globalstats-tab>
            </v-tabs-content>

            <v-tabs-content key="attendees" id="attendees">
              <attendee-tab
                v-if="$store.state.navigator.current.tab == 'attendees'"
              ></attendee-tab>
            </v-tabs-content>

            <v-tabs-content key="streams" id="streams">
              <stream-tab
                v-if="$store.state.navigator.current.tab == 'streams'"
              ></stream-tab>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./admin.ctrl.js"></script>
<style src="./admin.scss" lang="scss" scoped></style>
