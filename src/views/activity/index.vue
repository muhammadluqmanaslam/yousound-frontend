<template>
  <div class="page activity-page mx-5">
    <div class="d-flex">
      <div class="tab-container">
        <h2 class="page-title">Activity</h2>
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{active: isActiveTab(tab.id)}"
          ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>
        </ul>
      </div>

      <div class="tab-content" v-if="currentUser && isPageReady">
        <div v-if="!activities || activities.length == 0" class="empty-section">
          <p class="empty-title">No Activity</p>
          <p class="empty-description">This is where you'll see who followed, commented, and other activity.</p>
          <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
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
            >Load More</v-btn>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
