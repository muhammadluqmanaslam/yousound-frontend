<template>
  <div row wrap class="page manage-page">

    <v-dialog v-model="album_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete an Album</v-card-title>
        <v-card-text>If you click OK, your followers won't see the album any more. Click OK to delete &lt;{{ album.name }}&gt;, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="deleteAlbum()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="hideAlbumDeleteConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="album_status_confirm_dialog">
      <v-card>
        <v-card-title class="headline">{{ status_dialog_title }}</v-card-title>
        <v-card-text>{{ status_dialog_text }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="updateAlbumStatus()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="hideAlbumStatusConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Manage</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="$store.state.auth.user && isPageReady">
      <div class="manage-tab">
        <v-tabs dark v-model="tab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
                key="published"
                href="#published"
                @click.native="onTab('published')"
                ripple>Published</v-tabs-item>
            <v-tabs-item
                key="private"
                href="#private"
                @click.native="onTab('private')"
                ripple>Private</v-tabs-item>
            <v-tabs-item
                key="collaborated"
                href="#collaborated"
                @click.native="onTab('collaborated')"
                ripple>Collaborations</v-tabs-item>
            <v-tabs-item
                key="pending"
                href="#pending"
                @click.native="onTab('pending')"
                ripple>Pending Collaborations</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content key="published" id="published">
              <v-card flat>
                <v-layout row wrap class="covers-content">
                  <div class="card-container" v-for="(album, index) in published_albums" :key="index">
                    <album-card
                        :album="album"
                        :editButtonAction="editAlbum"
                        :deleteButtonAction="showAlbumDeleteConfirmDialog"
                        :updateButtonAction="showAlbumStatusConfirmDialog"></album-card>
                  </div>
                </v-layout>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="private" id="private">
              <v-card flat>
                <v-layout row wrap class="covers-content">
                  <div class="card-container" v-for="(album, index) in private_albums" :key="index">
                    <album-card
                        :album="album"
                        :showPromoteButton="false"
                        :editButtonAction="editAlbum"
                        :deleteButtonAction="showAlbumDeleteConfirmDialog"
                        :updateButtonAction="showAlbumStatusConfirmDialog"></album-card>
                  </div>
                </v-layout>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="collaborated" id="collaborated">
              <v-card flat>
                <v-layout row wrap class="covers-content">
                  <div class="card-container" v-for="(album, index) in collaborated_albums" :key="index">
                    <album-card
                        :album="album"
                        :editButtonAction="editAlbum"
                        :deleteButtonAction="showAlbumDeleteConfirmDialog"></album-card>
                  </div>
                </v-layout>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="pending" id="pending">
              <v-card flat>
                <v-layout row wrap class="covers-content">
                  <div class="card-container" v-for="(album, index) in pending_albums" :key="index">
                    <album-card v-if="album.user.id==$store.state.auth.user.id"
                        :album="album"
                        :showPromoteButton="false"
                        :editButtonAction="editAlbum"
                        :deleteButtonAction="showAlbumDeleteConfirmDialog"
                        :releaseButtonAction="releaseAlbum"></album-card>
                    <album-card v-else-if="notResponded(album)"
                        :album="album"
                        :showPromoteButton="false"
                        :acceptButtonAction="acceptAlbum"
                        :denyButtonAction="denyAlbum"></album-card>
                    <album-card v-else
                        :album="album"
                        :showPromoteButton="false"></album-card>
                  </div>
                </v-layout>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>

  </div>
</template>
<script type="text/javascript" src="./manage.ctrl.js"></script>

