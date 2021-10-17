<template>
  <div row wrap class="page manage-album-page">
    <div class="d-flex">
      <div class="page-content" v-if="currentUser && isPageReady">
        <div>
            <album-list
            v-for="(album, index) in setAlbumFilter()"
            :index="index"
            :key="index"
            :album="album"
            :showPromoteButton="false"
            :editButtonAction="editAlbum"
            :deleteButtonAction="openAlbumDeleteConfirmDialog"
            :videoOnlyButtonAction="openVideoOnlyConfirmDialog"
            :privateButtonAction="openPrivateConfirmDialog"
            :acceptButtonAction="acceptAlbum"
            :denyButtonAction="denyAlbum"
            ></album-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./manageAlbum.ctrl.js"></script>
