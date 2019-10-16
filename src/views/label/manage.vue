<template>
  <div row wrap class="page label-manage-page mx-5">
    <div v-if="currentUser.user_type == 'artist'" class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">My Labels</h2>
          <ul>
            <li
              v-for="tab in artist_tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{active: isActiveTab(tab.id)}"
            ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser && isPageReady">
        <div v-if="navigatorState.tab == 'approved_labels'">
          <v-card flat>
            <template v-if="!approved_labels || approved_labels.length == 0">
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">You have no approved labels</p>
              </div>
            </template>
            <template v-else>
              <v-layout row wrap>
                <template v-for="(relation, index) in approved_labels">
                  <label-user-item
                    :user="relation.host"
                    :deleteFunc="showLabelDeleteConfirmDialog"
                    :deleteButtonText="'remove label'"
                  ></label-user-item>
                </template>
              </v-layout>
            </template>
          </v-card>
        </div>

        <div v-if="navigatorState.tab == 'approved_albums'">
          <v-card flat>
            <template v-if="!approved_albums || approved_albums.length == 0">
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">You have no approved albums</p>
              </div>
            </template>
            <template v-else>
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(user_album, index) in approved_albums" :key="index">
                  <label-album-item
                    :album="user_album.album"
                    :user="user_album.user"
                    :type="'label'"
                    :deleteButtonFunc="showAlbumDeleteConfirmDialog"
                    :deleteButtonText="`Remove <br>from Record Label`"
                    :deleteButtonClass="`height text-xs-left`"
                  ></label-album-item>
                </div>
              </v-layout>
            </template>
          </v-card>
        </div>

        <div v-if="navigatorState.tab == 'pending_labels'">
          <v-card flat>
            <template v-if="!pending_labels || pending_labels.length == 0">
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">You have no pending labels</p>
              </div>
            </template>
            <template v-else>
              <v-layout row wrap>
                <template v-for="(relation, index) in pending_labels">
                  <label-user-item
                    :user="relation.host"
                    :acceptFunc="acceptLabelUserRequest"
                    :denyFunc="denyLabelUserRequest"
                  ></label-user-item>
                </template>
              </v-layout>
            </template>
          </v-card>
        </div>

        <div v-if="navigatorState.tab == 'pending_albums'">
          <v-card flat>
            <template v-if="!pending_albums || pending_albums.length == 0">
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">You have no pending albums</p>
              </div>
            </template>
            <template v-else>
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(user_album, index) in pending_albums" :key="index">
                  <label-album-item
                    :album="user_album.album"
                    :user="user_album.user"
                    :type="'label'"
                    :showPromoteButton="false"
                    :acceptButtonFunc="acceptLabelAlbumRequest"
                    :denyButtonFunc="denyLabelAlbumRequest"
                  ></label-album-item>
                </div>
              </v-layout>
            </template>
          </v-card>
        </div>
      </div>
    </div>

    <div v-if="currentUser.user_type == 'label'" class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Record Label</h2>
          <ul>
            <li
              v-for="tab in label_tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{active: isActiveTab(tab.id)}"
            ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser && isPageReady">
        <div v-if="navigatorState.tab == 'approved_labels'">
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
                  :deleteButtonText="'remove artist from roster'"
                ></label-user-item>
              </template>
            </v-layout>
          </v-card>
        </div>

        <div v-if="navigatorState.tab == 'approved_albums'">
          <v-card flat>
            <v-layout row wrap class="covers-content">
              <div class="card-container" v-for="(user_album, index) in approved_albums" :key="index">
                <label-album-item
                  :album="user_album.album"
                  :user="user_album.user"
                  :type="'label'"
                  :deleteButtonFunc="showAlbumDeleteConfirmDialog"
                  :deleteButtonText="`Remove <br>from Record Label`"
                  :deleteButtonClass="`height text-xs-left`"
                ></label-album-item>
              </div>
            </v-layout>
          </v-card>
        </div>

        <div v-if="navigatorState.tab == 'pending_labels'">
          <v-card flat>
            <v-layout row wrap>
              <template v-for="(relation, index) in not_approved_labels">
                <label-user-item
                  :user="relation.client"
                  :status="relation.status"
                  :deleteFunc="showLabelDeleteConfirmDialog"
                ></label-user-item>
              </template>
            </v-layout>
          </v-card>
        </div>

        <div v-if="navigatorState.tab == 'pending_albums'">
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
                  :status="user_album.status | capitalize"
                ></label-album-item>
              </div>
            </v-layout>
          </v-card>
        </div>
      </div>
    </div>

    <select-user-modal
      v-if="show_select_user_modal"
      title="Add Artist to Roster" 
      type="artist" 
      :dismiss="hideSelectUserDialog" 
      :selectUser="sendRequestToAdd"
    ></select-user-modal>

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

    <v-dialog v-model="show_help_dialog" content-class="my-dialog-2">
      <v-card>
        <v-card-title>
          <label>Labels</label>
        </v-card-title>
        <v-card-text>
          <div>
            <h4>Labels</h4>
            <ul>
              <li><b>Invite artists</b> to your roster.</li>
              <li><b>Request albums</b> to be added to your catalog.</li>
            </ul>
            <h4>Artists</h4>
            <ul>
              <li><b>Manage</b> your approved labels & albums.</li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark round color="blue" @click.native="closeHelpDialog()" class="px-4">Ok, Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./manage.ctrl.js"></script>
