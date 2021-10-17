<template>
  <v-flex class="timeline-user">
    <v-flex xs6 class="event-info">
      <div class="event-top-bar" pa-0>
        <div class="user-info">
          <profile-item
            :user="user"
            :className="'track-user-avatar'"
          ></profile-item>
          <div class="activity-section">
            <!-- <pre>{{ user }}</pre> -->
            <router-link class="user-name" :to="'/' + user.slug">{{
              user.display_name
            }}</router-link
            >&nbsp;
            <v-icon
              v-if="user.user_type == 'artist'"
              class="user-status"
              :class="{ online: user.status == 'active' }"
              >fa-check-circle</v-icon
            >&nbsp;
            <label class="description-text"
              >{{ actionText }}
              <!-- <label class="items-title" @click="doAction()">{{
                user.recent_items[0].assoc.name
              }}</label> -->
            </label>
          </div>
        </div>

        <div class="right-section">
          <v-menu
            offset-y
            class="track-more-action"
            :close-on-content-click="false"
          >
            <v-btn depressed :ripple="false" color="transparent" class="no-Btn-bg more-btn" slot="activator">
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile key="repost" @click.native="repostItem()">
                <v-list-tile-title class="default-menu-item">
                  <!-- <img
                    class="track-status-icon"
                    src="/static/images/ic_repeat.png"
                  /> -->
                  <label>Repost Album</label>
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                key="share"
                class="default-menu-item track-menu-item"
                @click.native="showShareDialog()"
              >
                <v-list-tile-title>
                  <!-- <img
                    class="track-status-icon"
                    src="/static/images/ic_share.png"
                  /> -->
                  <label>Share</label>
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </div>



      <v-layout row wrap class="covers-content" mt-2>
        <div
          v-for="(feed, index) in user.recent_items"
          v-if="['Album', 'ShopProduct', 'Stream'].indexOf(feed.assoc_type) > -1"
          :key="index"
          class="card-container"
        >
          <track-card
            v-if="feed.assoc_type == 'Album'"
            :objects="user.recent_items"
            :objectIndex="index"
          />
          <product-card
            v-if="feed.assoc_type == 'ShopProduct'"
            :dataObject="feed"
          />
          <video-box v-if="feed.assoc_type == 'Stream'" :item="feed.assoc" />
        </div>
      </v-layout>
    </v-flex>

    <merch-modal
      v-if="showMerchModal && user.recent_items[0].assoc_type === 'ShopProduct'"
      :item="user.recent_items[0].assoc"
      :dismiss="dimissMerchModal"
    />
  </v-flex>
</template>

<script type="text/javascript" src="./timeline.ctrl.js"></script>
<style src="../../../static/styles/timeline.scss" lang="scss" scoped>
