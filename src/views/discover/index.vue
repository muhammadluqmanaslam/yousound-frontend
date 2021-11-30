<template>
  <div class="page discover-page mx-5">
    <div class="d-flex">
    <content-top-header>
      <template slot="topHeader">
          <ul class="pr-3">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="isPageReady && onTab(tab.id)">{{
                tab.title
              }}</label>
            </li>
          </ul>
      </template>
    </content-top-header>

      <div class="page-content" v-if="currentUser">
          <discoverAlbum v-if="currentTabs.includes('music')" :isComp="isComp" :isSingleTab="isSingleTab" :listLimit="10" />
          <discoverVideo v-if="currentTabs.includes('video')" :isComp="isComp" :isSingleTab="isSingleTab" :listLimit="10" />
          <discoverProduct v-if="currentTabs.includes('merch')" :isComp="isComp" :listLimit="10" />

        </div>
    </div>

    <v-dialog
      v-if="currentUser"
      v-model="show_genre_selector_dialog"
      content-class="my-genre-dialog ma-0 pa-2"
    >
      <genre-dialog :dismiss="closeGenreSelectorDialog" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<style lang="scss" scoped></style>
