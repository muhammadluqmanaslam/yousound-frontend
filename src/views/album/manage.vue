<template>
  <div row wrap class="page manage-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Manage</h2>
          <ul>
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="onTab(tab.id)">{{ tab.title }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser && isPageReady">
        <div v-if="active_tab == 'published'">
          <div
            v-if="!published_albums || published_albums.length == 0"
            class="empty-section"
          >
            <p class="empty-title">You have not uploaded any albums yet</p>
            <router-link to="/upload/album" class="empty-discover-btn"
              >Upload</router-link
            >
          </div>
          <v-card flat v-else>
            <v-layout row wrap class="covers-content">
              <div
                class="card-container"
                v-for="(album, index) in published_albums"
                :key="index"
              >
                <album-card
                  :album="album"
                  :editButtonAction="editAlbum"
                  :deleteButtonAction="openAlbumDeleteConfirmDialog"
                  :videoOnlyButtonAction="openVideoOnlyConfirmDialog"
                  :privateButtonAction="openPrivateConfirmDialog"
                ></album-card>
              </div>
            </v-layout>
          </v-card>
        </div>

        <div v-if="active_tab == 'private'">
          <div
            v-if="!private_albums || private_albums.length == 0"
            class="empty-section"
          >
            <p class="empty-title">You have no private albums</p>
          </div>
          <v-card flat v-else>
            <v-layout row wrap class="covers-content">
              <div
                class="card-container"
                v-for="(album, index) in private_albums"
                :key="index"
              >
                <album-card
                  :album="album"
                  :showPromoteButton="false"
                  :editButtonAction="editAlbum"
                  :deleteButtonAction="openAlbumDeleteConfirmDialog"
                  :publishButtonAction="openPublishConfirmDialog"
                ></album-card>
              </div>
            </v-layout>
          </v-card>
        </div>

        <div v-if="active_tab == 'video_only'">
          <div
            v-if="!video_only_albums || video_only_albums.length == 0"
            class="empty-section"
          >
            <p class="empty-title">You have no albums only for live video</p>
          </div>
          <v-card flat v-else>
            <v-layout row wrap class="covers-content">
              <div
                class="card-container"
                v-for="(album, index) in video_only_albums"
                :key="index"
              >
                <album-card
                  :album="album"
                  :showPromoteButton="false"
                  :editButtonAction="editAlbum"
                  :deleteButtonAction="openAlbumDeleteConfirmDialog"
                  :publishButtonAction="openPublishConfirmDialog"
                ></album-card>
              </div>
            </v-layout>
          </v-card>
        </div>

        <div v-if="active_tab == 'collaborated'">
          <div
            v-if="!collaborated_albums || collaborated_albums.length == 0"
            class="empty-section"
          >
            <p class="empty-title">You have no album collaborations</p>
          </div>
          <v-card flat v-else>
            <v-layout row wrap class="covers-content">
              <div
                class="card-container"
                v-for="(album, index) in collaborated_albums"
                :key="index"
              >
                <album-card
                  :album="album"
                  :editButtonAction="editAlbum"
                  :deleteButtonAction="openAlbumDeleteConfirmDialog"
                ></album-card>
              </div>
            </v-layout>
          </v-card>
        </div>

        <div v-if="active_tab == 'pending'">
          <div
            v-if="!pending_albums || pending_albums.length == 0"
            class="empty-section"
          >
            <p class="empty-title">You have no pending album collaborations</p>
          </div>
          <v-card flat v-else>
            <v-layout row wrap class="covers-content">
              <div
                class="card-container"
                v-for="(album, index) in pending_albums"
                :key="index"
              >
                <album-card
                  v-if="album.user.id == $store.state.auth.user.id"
                  :album="album"
                  :showPromoteButton="false"
                  :editButtonAction="editAlbum"
                  :deleteButtonAction="openAlbumDeleteConfirmDialog"
                  :releaseButtonAction="releaseAlbum"
                ></album-card>
                <album-card
                  v-else-if="notResponded(album)"
                  :album="album"
                  :showPromoteButton="false"
                  :acceptButtonAction="acceptAlbum"
                  :denyButtonAction="denyAlbum"
                ></album-card>
                <album-card
                  v-else
                  :album="album"
                  :showPromoteButton="false"
                ></album-card>
              </div>
            </v-layout>
          </v-card>
        </div>
      </div>
    </div>

    <div class="album-finish-section" v-if="show_album_finish_modal">
      <div class="dismiss-section" @click="closeAlbumFinishModal()"></div>
      <v-layout row wrap class="popup-section">
        <v-flex xs12 class="title-section">
          <label class="title-text"
            >This album is pending release,
            <router-link to="/upload/album" class="link-text"
              >upload another</router-link
            ></label
          >
        </v-flex>
        <v-flex xs12 class="promote-album-section">
          <v-flex xs12 class="header-section">
            <label class="header-text">What Next?</label>
          </v-flex>
          <div class="content-section">
            <div class="promote-album-image">
              <div
                class="promote-image"
                :style="{ 'background-image': 'url(' + album.cover.url + ')' }"
              ></div>
            </div>
            <div class="promote-album-description">
              <p>
                When you added collaborators accept your collaboration via
                Direct Message or Manage > Pending Collaborations, you will then
                be able to release the album.
              </p>
              <p>
                Visit Manage > Pending Collaborations to see who accepted and/or
                denied your collaboration.
              </p>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>

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

    <v-dialog v-model="show_publish_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Publish an Album</v-card-title>
        <v-card-text
          >If you click OK, the album will be published. Click OK to publish, or
          click Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="publishAlbum()"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closePublishConfirmDialog()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_private_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Private an Album</v-card-title>
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
  </div>
</template>

<script type="text/javascript" src="./manage.ctrl.js"></script>
