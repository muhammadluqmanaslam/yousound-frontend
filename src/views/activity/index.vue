<template>
  <div class="page activity-page">
    <div class="d-flex">
      <div class="page-content" v-if="currentUser && isPageReady">
        <div v-if="!activities || activities.length == 0" class="empty-section">
          <p class="empty-title">No Activity</p>
          <p class="empty-description">
            This is where you'll see who followed, commented, and other
            activity.
          </p>
          <router-link to="/album" class="empty-discover-btn"
            >Discover</router-link
          >
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
              >Load More</v-btn
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
