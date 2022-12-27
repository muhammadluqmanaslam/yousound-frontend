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
            :textBtnToRight="textBtnToRight"
            ></album-list>
        </div>

        <v-dialog v-model="show_private_confirm_dialog">
          <v-card>
            <v-card-title class="headline">Make album private</v-card-title>
            <v-card-text
              >If you make this album private it will be removed from public feeds
              and reposts. Click OK to private, or click Cancel.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="privateAlbum()"
                >Ok</v-btn
              >
              <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="closePrivateConfirmDialog()"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="show_video_only_confirm_dialog">
          <v-card>
            <v-card-title class="headline"
              >Make an album available only for live</v-card-title
            >
            <v-card-text
              >If you click OK, the album will be available only for live
              video.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="videoOnlyAlbum()"
                >Ok</v-btn
              >
              <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="closeVideoOnlyConfirmDialog()"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="show_album_delete_confirm_dialog">
          <v-card>
            <v-card-title class="headline">Delete an Album</v-card-title>
            <v-card-text
              >If you click OK, your followers won't see the album any more. Click
              OK to delete &lt;{{ album.name }}&gt;, or click Cancel.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="deleteAlbum()"
                >Ok</v-btn
              >
              <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="closeAlbumDeleteConfirmDialog()"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./manageAlbum.ctrl.js"></script>
