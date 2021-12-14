<template>
  <div class="page discover-page mx-5">
    <discover-nav pageName="discover" />

    <div class="d-flex">
      <div class="page-content" v-if="currentUser">
        <discoverAlbum :isComp="isComp" :listLimit="10" />
        <discoverVideo :isComp="isComp" :listLimit="10" />
        <discoverProduct :isComp="isComp" :listLimit="8" />
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
