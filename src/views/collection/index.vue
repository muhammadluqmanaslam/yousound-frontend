<template>
  
  <div class="page collection-page mx-5" v-if="isSubscribed">
    <content-top-header class="mt-3">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ 'active tab-active': isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)" class="innerBold">{{
              tab.title
            }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <repost-music v-show="activeTab === 'music'" />
    <repost-videos v-show="activeTab === 'videos'" />
    <repost-products v-show="activeTab === 'products'" />
  </div>
  <div v-else>
    <AuthPlan />
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
