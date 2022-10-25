<template>
  <div class="relative">
  <div class="page discover-page mx-5">
    <!-- <discover-nav pageName="discover" /> -->

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

    <div class="d-flex">
      <div class="page-content">
        <discover-album :isComp="isComp" :listLimit="10" />
        <discover-video :isComp="isComp" :listLimit="6" />
        <discover-product :isComp="isComp" :listLimit="8" />
      </div>
    </div>

    <v-dialog
      v-model="show_genre_selector_dialog"
      content-class="my-genre-dialog ma-0 pa-2"
    >
      <genre-dialog :dismiss="closeGenreSelectorDialog" />
    </v-dialog>

  </div>
</div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
