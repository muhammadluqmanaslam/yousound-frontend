<template>
  <div class="page stream-page mx-5">
    <div class="d-flex">
      <div class="tab-container">
        <h2 class="page-title">Feed</h2>
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{active: isActiveTab(tab.id)}"
          ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>
        </ul>
      </div>

      <div class="tab-content" v-if="currentUser">
        <div v-if="!users || users.length == 0" class="empty-section">
          <p class="empty-title">Your stream is empty</p>
          <p class="empty-description">Follow people to discover new music &amp; products.</p>
          <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
        </div>
        <div v-else>
          <div v-for="(user, user_index) in users" :key="user_index">
            <v-layout row wrap class="covers-content" v-if="user.recent_items">
              <stream-user :user="user"></stream-user>
            </v-layout>
          </div>
          <div class="text-xs-center">
            <v-btn
              v-show="page_index < total_pages"
              @click.native="loadMore()"
              class="loadmore-btn"
            >Load More</v-btn>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="show_help_dialog" content-class="my-dialog-2">
      <v-card>
        <v-card-title>
          <label>Feed</label>
        </v-card-title>
        <v-card-text>
          <ul>
            <li>View content <b>chronologically</b> from people you follow.</li>
            <li><b>Easily sort feed</b> by albums, products, video, reposts & playlists.</li>
            <li>Listen to albums & add products to cart <b>from the feed</b>.</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn dark round color="blue" @click.native="closeHelpDialog()" class="px-4">Ok, Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
