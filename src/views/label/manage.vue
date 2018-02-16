<template>
  <div row wrap class="page label-manage-page">
    <select-user-modal v-if="show_select_user_modal"
        title="Add Artist to Roster" 
        type="artist" 
        :dismiss="hideSelectUserDialog" 
        :selectUser="sendRequestToAdd"></select-user-modal>

    <v-dialog v-model="label_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Label</v-card-title>
        <v-card-text>If you click OK, you won't see this label any more. Click OK to delete &lt;{{ user.display_name }}&gt;, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="removeLabel()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="hideLabelDeleteConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="roster_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Roster</v-card-title>
        <v-card-text>If you click OK, you won't add roster's album to your label any more. Click OK to delete &lt;{{ user.display_name }}&gt;, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="removeRoster()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="hideRosterDeleteConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="album_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Remove an Album from your Record Label</v-card-title>
        <v-card-text>If you click OK, your followers won't see the album any more. Click OK to remove &lt;{{ album.name }}&gt;, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="removeAlbum()">Ok</v-btn>
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

    <template v-if="$store.state.auth.user.user_type == 'artist'">
      <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
        <h2 class="page-title">My Labels</h2>
      </v-flex>

      <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="isPageReady">
        <div class="manage-tab">
          <v-tabs dark v-model="navigatorState.tab">
            <v-tabs-bar class="transparent">
              <v-tabs-item
                key="approved_labels"
                href="#approved_labels"
                @click.native="onTab('approved_labels')"
                ripple>Labels</v-tabs-item>
              <v-tabs-item
                key="approved_albums"
                href="#approved_albums"
                @click.native="onTab('approved_albums')"
                ripple>Approved albums</v-tabs-item>
              <v-tabs-item
                key="pending_labels"
                href="#pending_labels"
                @click.native="onTab('pending_labels')"
                ripple>Pending labels</v-tabs-item>
              <v-tabs-slider color="black"></v-tabs-slider>
              <v-tabs-item
                key="pending_albums"
                href="#pending_albums"
                @click.native="onTab('pending_albums')"
                ripple>Pending albums</v-tabs-item>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content key="approved_labels" id="approved_labels">
                <v-card flat>
                  <v-layout row wrap>
                    <template v-for="(relation, index) in approved_labels">
                      <label-user-item
                          :user="relation.host"
                          :deleteFunc="showLabelDeleteConfirmDialog"
                          :deleteButtonText="'remove label'"></label-user-item>
                    </template>
                  </v-layout>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="approved_albums" id="approved_albums">
                <v-card flat>
                  <v-layout row wrap class="covers-content">
                    <div class="card-container" v-for="(user_album, index) in approved_albums" :key="index">
                      <label-album-item
                          :album="user_album.album"
                          :user="user_album.user"
                          :type="'label'"
                          :deleteButtonFunc="showAlbumDeleteConfirmDialog"
                          :deleteButtonText="`Remove <br>from Record Label`"
                          :deleteButtonClass="`height text-xs-left`"></label-album-item>
                    </div>
                  </v-layout>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="pending_labels" id="pending_labels">
                <v-card flat>
                  <v-layout row wrap>
                    <template v-for="(relation, index) in pending_labels">
                      <label-user-item
                          :user="relation.host"
                          :acceptFunc="acceptLabelUserRequest"
                          :denyFunc="denyLabelUserRequest"></label-user-item>
                    </template>
                  </v-layout>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="pending_albums" id="pending_albums">
                <v-card flat>
                  <v-layout row wrap class="covers-content">
                    <div class="card-container" v-for="(user_album, index) in pending_albums" :key="index">
                      <label-album-item
                          :album="user_album.album"
                          :user="user_album.user"
                          :type="'label'"
                          :showPromoteButton="false"
                          :acceptButtonFunc="acceptLabelAlbumRequest"
                          :denyButtonFunc="denyLabelAlbumRequest"></label-album-item>
                    </div>
                  </v-layout>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-flex>
    </template>

    <template v-else-if="$store.state.auth.user.user_type == 'label'">
      <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
        <h2 class="page-title">Record Label</h2>
      </v-flex>

      <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="isPageReady">
        <div class="manage-tab">
          <v-tabs dark v-model="navigatorState.tab">
            <v-tabs-bar class="transparent">
              <v-tabs-item
                key="approved_labels"
                href="#approved_labels"
                @click.native="onTab('approved_labels')"
                ripple>Roster</v-tabs-item>
              <v-tabs-item
                key="approved_albums"
                href="#approved_albums"
                @click.native="onTab('approved_albums')"
                ripple>Albums</v-tabs-item>
              <v-tabs-item
                key="pending_labels"
                href="#pending_labels"
                @click.native="onTab('pending_labels')"
                ripple>Pending Artists</v-tabs-item>
              <v-tabs-item
                key="pending_albums"
                href="#pending_albums"
                @click.native="onTab('pending_albums')"
                ripple>Pending Albums</v-tabs-item>
              <v-tabs-slider color="black"></v-tabs-slider>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content key="approved_labels" id="approved_labels">
                <v-card flat>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-btn class="add-product-btn" @click.native="showSelectUserDialog()">
                        <v-icon>add</v-icon>Add Artist
                      </v-btn>
                    </v-flex>
                    <template v-for="(relation, index) in approved_labels">
                      <label-user-item
                          :user="relation.client"
                          :deleteFunc="showRosterDeleteConfirmDialog"
                          :deleteButtonText="'remove artist from roster'"></label-user-item>
                    </template>
                  </v-layout>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="approved_albums" id="approved_albums">
                <v-card flat>
                  <v-layout row wrap class="covers-content">
                    <div class="card-container" v-for="(user_album, index) in approved_albums" :key="index">
                      <label-album-item
                        :album="user_album.album"
                        :user="user_album.user"
                        :type="'label'"
                        :deleteButtonFunc="showAlbumDeleteConfirmDialog"
                        :deleteButtonText="`Remove <br>from Record Label`"
                        :deleteButtonClass="`height text-xs-left`"></label-album-item>
                    </div>
                  </v-layout>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="pending_labels" id="pending_labels">
                <v-card flat>
                  <v-layout row wrap>
                    <template v-for="(relation, index) in not_approved_labels">
                      <label-user-item
                          :user="relation.client"
                          :status="relation.status"
                          :deleteFunc="showLabelDeleteConfirmDialog"></label-user-item>
                    </template>
                  </v-layout>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="pending_albums" id="pending_albums">
                <v-card flat>
                  <v-layout row wrap class="covers-content">
                    <div class="card-container" v-for="(user_album, index) in not_approved_albums" :key="index">
                      <label-album-item
                          :album="user_album.album"
                          :user="user_album.user"
                          :type="'label'"
                          :showPromoteButton="false"
                          :deleteButtonFunc="showAlbumDeleteConfirmDialog"
                          :deleteButtonText="`Remove <br>from Record Label`"
                          :deleteButtonClass="'height text-xs-left'"
                          :status="user_album.status | capitalize"></label-album-item>
                    </div>
                  </v-layout>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-flex>
    </template>

  </div>
</template>
<script type="text/javascript" src="./manage.ctrl.js"></script>

