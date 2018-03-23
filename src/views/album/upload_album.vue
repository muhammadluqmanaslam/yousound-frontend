<template>
  <v-layout row wrap class="page upload-album-page" v-if="isPageReady">
    <v-dialog v-model="collaborators_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Confirm Collaborators</v-card-title>
        <v-card-text>Make sure to add any collaborators to your album, once it's uploaded you won't be able to add collaborators</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="releaseNow()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="hideCollaboratorsConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-flex xs12 relative>
      <v-flex xs12 pa-0>
        <track-uploader accept=".mp3" :autoUpload="true" :album="album"></track-uploader>
      </v-flex>

      <v-flex xs12 album-info-section v-if="album.tracks.length" id="album_info_section">
        <v-flex xs12 pa-0>
          <h4 class="album-info-title">Album Info</h4>
        </v-flex>
        <v-flex xs12 pr-0>
          <v-layout row class="album-section">
            <div class="album-image-section"> 
              <div class="image-section">
                <!-- <img class="album-image" id="album_image" v-if="album.image"/> -->
                <div class="album-image" id="album_image" v-if="album_image_url" :style="`background-image: url(${album_image_url})`"></div>
                <div class="album-image-upload-section" v-if="!album_image_url">
                  <input type="file" name="album_image_file" id="album_image_file" class="add-album-image-file" accept="image/*" @change="imageChanged($event)">
                  <label for="album_image_file">
                    <v-icon class="camera">photo_camera</v-icon>Add Image
                  </label>
                </div>
              </div>
              <div class="image-change-section">
                <input type="file" name="album_image_file" id="album_image_file" class="change-album-image-file" accept="image/*" @change="imageChanged($event)">
                <label for="album_image_file" v-if="album_image_url">Change</label>
              </div>
            </div>
            <div class="album-content-section">
              <v-flex xs-12 form-group>
                <label class="control-label">Album Title<label class="required">*</label></label>
                <input type="text" class="form-control" v-model="album.name">
              </v-flex>
              <v-flex xs12>
                <label class="control-label">Genre<label class="required">*</label></label>
                <v-select
                  v-bind:items="genres"
                  v-model="album.genre"
                  item-text="name"
                  item-value="id"
                  autocomplete
                  class="pt-0"
                  no-data-text="No genres found"></v-select>
              </v-flex>
              <v-flex xs12>
                <label class="control-label">Merch</label>
                <v-select
                  v-bind:items="products"
                  v-model="selected_products"
                  item-text="name"
                  item-value="id"
                  chips
                  max-height="auto"
                  class="pt-0"
                  no-data-text="No merch found"
                  autocomplete
                  clearable>
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi">
                      <v-avatar>
                        <img :src="data.item.covers[0].cover.thumb.url">
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.covers[0].cover.thumb.url"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 pb-3>
                <label class="control-label">Album Description</label>
                <textarea v-model="album.description" class="album-description form-control non-resizable"></textarea>
              </v-flex>
            </div>
          </v-layout>
        </v-flex>

        <v-flex xs12 class="collaborator-section">
          <v-flex xs12>
            <v-layout>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Collaborators</h4>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="collaborators.length < 3">
            <v-flex xs12 sm6 pa-0>
              <v-btn class="add-option-btn ma-0" @click.native="addCollaborator()">
                <v-icon>add</v-icon> Add another
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs12 sm6 pa-0>
            <v-layout row option-content v-for="(collaborator, index) in collaborators" :key="index">
              <v-flex xs12 sm6>
                <label class="control-label">Collaborators<label class="required">*</label></label>
                <!-- <input type="text" class="form-control" v-model="collaborator.user_id"> -->
                <v-select
                  v-bind:items="users"
                  v-model="collaborator.user_id"
                  item-text="username"
                  item-value="id"
                  chips
                  max-height="auto"
                  class="pt-0"
                  no-data-text="No artist found"
                  autocomplete>
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi">
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url">
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.username"></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label">Role<label class="required">*</label></label>
                <v-select
                  v-bind:items="role_types"
                  v-model="collaborator.user_role"
                  item-text="name"
                  item-value="name"
                  class="pt-0"
                  autocomplete></v-select>
              </v-flex>
              <v-icon class="clear-btn" @click="deleteCollaborator(index)">clear</v-icon>
            </v-layout>
          </v-flex>
        </v-flex>

        <v-flex xs12 class="contributor-section">
          <v-flex xs12>
            <v-layout>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Album Credits</h4>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-flex xs12 sm6 pa-0>
              <v-btn class="add-option-btn ma-0" @click.native="addContributor()">
                <v-icon>add</v-icon> Add another
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs12 sm6 pa-0>
            <v-layout row option-content v-for="(contirbutor, index) in contributors" :key="index">
              <v-flex xs12 sm6>
                <label class="control-label">Username<label class="required">*</label></label>
                <v-select
                  :items="users"
                  v-model="contirbutor.user_id"
                  item-text="username"
                  item-value="id"
                  chips
                  max-height="auto"
                  class="pt-0"
                  no-data-text="No user found"
                  autocomplete
                  clearable>
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi">
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url">
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.username"></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label">Role<label class="required">*</label></label>
                <v-select
                  :items="role_types"
                  v-model="contirbutor.user_role"
                  item-text="name"
                  item-value="name"
                  class="pt-0"
                  autocomplete></v-select>
              </v-flex>
              <v-icon class="clear-btn" @click="deleteContributor(index)">clear</v-icon>
            </v-layout>
          </v-flex>
        </v-flex>

        <v-flex xs12 album-action-section>
          <v-layout row>
            <v-flex xs12 sm-6>
              <!-- <a class="delete-album-btn" @click="deleteAlbum()">Remove Album</a> -->
            </v-flex>
            <v-flex xs12 sm-6>
              <v-btn class="release-now-btn" flat @click.native="beforeReleaseNow()" :disabled="!isAvailableToUploadAlbum">Release Now</v-btn>
              <v-btn class="save-for-later-btn" flat @click.native="saveForLater()" v-if="false">Save for later</v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>
      <v-footer>
        <a href="#">FAQ</a>
        <a href="#">Blog</a>
        <a href="#">Help</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
        <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
      </v-footer>
    </v-flex>
  </v-layout>
</template>
<script type="text/javascript" src="./upload_album.ctrl.js"></script>

