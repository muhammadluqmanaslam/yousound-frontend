<template>
  <div class="page collection-page mx-5 margin-top-header" v-if="pageReady">
    <content-top-header class="mt-3 black-theme">
      <template slot="topHeader">
        <ul>
          <li class="active">
            <label class="innerBold">
              Collection >
            </label>
          </li>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ 'active ': isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)" class="innerBold">{{
              tab.title
            }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <repost-music
      :tracks="this.tracks"
      :playlists="this.playlist_data.playlists.filter((c) => c.playlist_type == 'tracks')"
      v-show="activeTab === 'music'"
    />
    <repost-videos
      :streams="streams"
      :playlists="this.playlist_data.playlists.filter((c) => c.playlist_type == 'streams')"
      v-show="activeTab === 'videos'"
    />
    <repost-products
      :products="products"
      :playlists="this.playlist_data.playlists.filter((c) => c.playlist_type == 'products')"
      v-show="activeTab === 'products'" />
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
