<template>
  <div class="page feed-page">
    <tab-nav v-if="users || users.length" :tabData="tabs" ref="tabData" @tabClicked="tabClicked" class="pl-3" />

    <div class="page-content" v-if="currentUser">
      <div v-if="!users || users.length == 0" class="empty-section px-3">
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
          <v-container fluid grid-list-md px-0>
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

    <v-btn
      fab
      class="post-thought-btn white--text"
      @click="init_PostThought = true" 
    >
      <img :src="require('../../../../static/images/type-thought.svg')" width="20" />
    </v-btn>

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

    <v-dialog
      v-model="init_PostThought"
      content-class="init_PostThought"
      fullscreen
    >
      <div v-if="!isPostThoughtActive" class="pre-post text-center">
        <div class="dflex top-wrapper">
          <div class="centerLogo">
            <img src='../../../../static/images/nav_logo_primary.png' width="120" />
          </div>
          <img src='../../../../static/images/ic_close_dark.svg' class="cursor-pointer" @click="init_PostThought = false" />

        </div>

        <div class="body-wrapper">
          <h3 class="mb-2">Introducing</h3>
          <h1>Thoughts</h1>

          <img :src="require('../../../../static/images/pre-thought.svg')">

          <ul>
            <li>Post your thought</li>
            <li>Attach content from profile</li>
            <li>Followers can reply with content</li>
            <li>Thoughts delete after 7 days</li>
          </ul>

          <v-spacer></v-spacer>

          <v-btn
            round
            dark
            class="pre-btn"
            @click="postThoughtActive"
          >
            Ok, got it
          </v-btn>
        </div>
      </div>

      <div v-else-if="isPostThoughtActive" class="post-thought">
        <div class="dflex justify-space-between align-center top-wrapper">
          <div class="centerLogo">
            <v-btn
              depressed
              class="no-Btn-bg transparent"
            >Cancel</v-btn>
          </div>

          <div class="dflex align-center">
            <div class="thought-char-count mr-2">
              {{ charCount }}/{{ thoughtMaxChar }}
            </div>
            <v-btn
              round
              depressed
              :disabled="thought.length < 1"
            >
              Post
            </v-btn>
          </div>
        </div>


        <div class="body-wrapper">
          <div class="thought-compose">
            <user-tag :user="currentUser" showAvatar hideName hideTick width="35" height="35" />
            <textarea
              v-model.trim="thought"
              cols="300"
              :maxlength="thoughtMaxChar"
              class="thought-input-area"
              placeholder="Share your thoughts..."
              ref="thought"
            ></textarea>
          </div>
        </div>

        <div class="thought-attachment">
          <div class="thought-attachment-previews">
            <div class="_preview add-attachment dflex align-center justify-center">
              <v-icon>add</v-icon>
            </div>
            <div class="_preview"></div>
          </div>
        </div>

        <div class="allow-attach dflex align-center justify-space-between">
          <div class="allow-attach-label">
            Allow replies with attachment
          </div>

          <v-switch
            v-model="allowAttachmentReply"
            color="green"
            class="allow-attach-switch"
            hide-details
          ></v-switch>
        </div>


      </div>
    </v-dialog>

    <post-thought ref="postThought" />
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<style lang="scss" scoped>
.post-thought-btn {
  position: fixed;
  right: 10px;
  bottom: 40px;
  z-index: 1;
  background: #ffffff !important;
  font-weight: 800;
}
</style>
