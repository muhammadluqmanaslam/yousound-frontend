<template>
  <div class="page admin-page">
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Admin</h2>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="admin-tab mt-4">
        <v-tabs dark>
          <v-tabs-bar class="pl-4 indigo" dark>
            <v-tabs-item v-for="tab in tabs"
              v-if="$store.state.auth.user.user_type=='admin' || ($store.state.auth.user.user_type=='moderator' && tab.id=='users')"
              :key="tab.id"
              :href="'#' + tab.id"
              @click.native="onTab(tab.id)"
              ripple>{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="white"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content key="users" id="users">
              <user-tab v-if="$store.state.auth.tab == 'users'"></user-tab>
            </v-tabs-content>
            <v-tabs-content key="albums" id="albums">
              <album-tab v-if="$store.state.auth.tab == 'albums'"></album-tab>
            </v-tabs-content>
            <v-tabs-content key="signups" id="signups">
              <signup-tab v-if="$store.state.auth.tab == 'signups'"></signup-tab>
            </v-tabs-content>
            <v-tabs-content key="genres" id="genres">
              <genre-tab v-if="$store.state.auth.tab == 'genres'"></genre-tab>
            </v-tabs-content>
            <v-tabs-content key="settings" id="settings">
              <setting-tab v-if="$store.state.auth.tab == 'settings'"></setting-tab>
            </v-tabs-content>
            <v-tabs-content key="globalstats" id="globalstats">
              <v-card flat>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-select
                      v-bind:items="globalstats_categories"
                      v-model="globalstats_category"
                      class="normal-input ml-4"
                      autocomplete></v-select>
                  </v-flex>
                </v-layout>
                <v-data-table
                  v-bind:items="globalstats"
                  class="globalstats-table">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.name }}</td>
                    <td class="text-xs-right">{{ props.item.value }}</td>
                  </template>
                  <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                    From {{ pageStart }} to {{ pageStop }}
                  </template>
                </v-data-table>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./admin.ctrl.js"></script>
