<template>
  
  <div class="page collection-page mx-5">
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
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
