<template>
  <div class="page discover-page mx-5">
    <discover-nav pageName="discover" />

    <div class="d-flex">
      <div class="page-content" v-if="currentUser">
        <transition name="slide-fade">
          <div class="global-search-box">
            <v-icon>search</v-icon>
            <input
              v-model="keyword"
              class="search-field"
              type="search"
              id="search"
              placeholder="Search artist, song or keyword"
              @keyup.enter="goToSearch()"
            />
          </div>
        </transition>

          <discoverAlbum :isComp="isComp" :listLimit="10" />
          <discoverVideo :isComp="isComp" :listLimit="10" />
          <discoverProduct :isComp="isComp" :listLimit="10" />

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
