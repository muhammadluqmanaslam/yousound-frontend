<template>
  <div class="page stream-page px-5">
    <content-top-header>
      <template slot="topHeader">
          <ul>
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              class="nav-li"
              :class="[{ active: isActiveTab(tab.id) }, `nav-${tab.id}`]"
            >
              <label class="nav-label" @click="onTab(tab.id)">
                <img :src="tab.icon" width="18" class="li-icon">
                {{ tab.title }}
              </label>
            </li>

            <v-spacer></v-spacer>

            <li>
              <v-btn
                round
                depressed 
                class="post-thought-btn white--text"
                @click="postThoughtActive" 
              >
                <img :src="require('../../../static/images/post-thought.svg')" width="17" class="mr-2" />
                <span>Post Thought</span>
              </v-btn>
            </li>
          </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content" v-if="currentUser">
        <div v-if="!users || users.length == 0" class="empty-section">
          <p class="empty-title">Your feed is empty</p>
          <p class="empty-description">
            Follow people to discover new music &amp; products.
          </p>
          <router-link :to="{name: 'DiscoverIndex'}" class="empty-discover-btn">
            Discover
          </router-link>
        </div>
        <div v-else>
          <div>
            <!-- <pre>{{ user }}</pre> -->
            <v-container fluid grid-list-md pl-0>
              <v-layout row wrap class="covers-content">
                <!-- <template v-if="user.recent_items"> -->
                  <v-flex xs12 md6 v-for="(user, user_index) in users" :key="user_index">
                    <timeline :user="user" />
                  </v-flex>
                <!-- </template> -->
              </v-layout>
            </v-container>
          </div>
          <div class="text-xs-center">
            <v-btn
              v-show="page_index < total_pages"
              @click.native="loadMore()"
              class="loadmore-btn"
              >Load More</v-btn
            >
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
            <li>
              <b>Easily sort feed</b> by albums, products, video, reposts &
              playlists.
            </li>
            <li>
              Listen to albums & add products to cart <b>from the feed</b>.
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeHelpDialog()"
            class="px-4"
            >Ok, Got it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <post-thought ref="postThought" />
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style lang="scss" scoped>
.post-thought-btn {
  background: #0386FF !important;
  font-weight: 800;
}
</style>
