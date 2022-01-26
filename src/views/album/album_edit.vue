<template>
  <v-layout row wrap class="page upload-album-page">
    <!-- 
      Working on Component redundancy
      Working to merge Create and Edit together to share same component
      Check created in /upload_album.vue
    -->
    <v-flex xs12 relative v-if="isPageReady">
      <v-flex xs12 pa-0>
        <track-uploader
          accept=".mp3"
          :autoUpload="true"
          :album="album"
        ></track-uploader>
      </v-flex>

      <v-flex
        xs12
        album-info-section
        v-if="album.tracks.length"
        id="album_info_section"
      >
        <v-flex xs12 pa-0>
          <h4 class="album-info-title">Info</h4>
        </v-flex>
        <v-flex xs12 pr-0>
          <v-layout row>
            <div class="album-image-section">
              <div class="image-section">
                <div
                  class="album-image"
                  id="album_image"
                  v-if="album_image_url"
                  :style="`background-image: url(${album_image_url})`"
                ></div>
                <div class="album-image-upload-section" v-if="!album_image_url">
                  <input
                    type="file"
                    name="album_image_file"
                    id="album_image_file"
                    class="add-album-image-file"
                    accept="image/*"
                    @change="imageChanged($event)"
                  />
                  <label for="album_image_file">
                    <v-icon class="camera">photo_camera</v-icon>Add Image
                  </label>
                </div>
              </div>
              <div class="image-change-section">
                <input
                  type="file"
                  name="album_image_file"
                  id="album_image_file"
                  class="change-album-image-file"
                  accept="image/*"
                  @change="imageChanged($event)"
                />
                <label for="album_image_file" v-if="album_image_url"
                  >Change</label
                >
              </div>
              <div>
                <v-checkbox
                  label="Only For Live Stream"
                  v-model="album.is_only_for_live_stream"
                ></v-checkbox>
                <span class="grey--text lighten-2"
                  >If checked, album will not appear on profile & won't be
                  reposted when downloaded from broadcast</span
                >
              </div>
            </div>
            <div class="album-content-section layout row wrap">
              <v-flex xs12 form-group>
                <label class="control-label"
                  >Album Title<label class="required">*</label></label
                >
                <input type="text" class="form-control" v-model="album.name" />
              </v-flex>
              <v-flex xs12 sm6 form-group pr-3>
                <label class="control-label"
                  >Released Date<label class="required">*</label></label
                >
                <v-menu
                  class="released-at-picker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  lazy
                >
                  <v-text-field
                    slot="activator"
                    v-model="album.released_at"
                    prepend-icon="event"
                    readonly
                  />
                  <v-date-picker
                    v-model="album.released_at"
                    no-title
                    scrollable
                    actions
                  >
                    <template slot-scope="{ save, cancel }">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="cancel"
                          >Cancel</v-btn
                        >
                        <v-btn flat color="primary" @click="save">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label"
                  >Location this album represents</label
                >
                <v-select
                  :items="locations"
                  v-model="album.location"
                  item-text="name"
                  item-value="name"
                  placeholder="Type name to search"
                  class="pt-0"
                  single-line
                  autocomplete
                />
              </v-flex>
              <v-flex xs12 form-group>
                <label class="control-label"
                  >Genre<label class="required">*</label></label
                >
                <input
                  :value="$store.getters['genreSelector/genre'].name"
                  @click="openGenreSelectorDialog()"
                  type="text"
                  class="form-control"
                  readonly
                />
                <!-- <v-select
                  :items="genres"
                  v-model="genre"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                  autocomplete
                /> -->
              </v-flex>
              <v-flex xs12 form-group>
                <label class="control-label">This album includes</label>
                <div class="album-content-wrapper">
                  <v-checkbox
                    v-model="album.is_content_acapella"
                    label="Acapella"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="album.is_content_instrumental"
                    label="Instrumental"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="album.is_content_stems"
                    label="Stems"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="album.is_content_remix"
                    label="Remix"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="album.is_content_dj_mix"
                    label="DJ Mix"
                  ></v-checkbox>
                </div>
              </v-flex>
              <v-flex xs12 form-group enabled-sample-wrapper>
                <label class="control-label"
                  >Allow Verified Artists to sample/mix content from this
                  album?</label
                >
                <span
                  class="border-bottom"
                  @click="openSampleClearanceLicenseModal()"
                  >More Info</span
                >
                <v-radio-group v-model="album.enabled_sample" row>
                  <v-radio value="false" label="No" light></v-radio>
                  <v-radio value="true" label="Yes" light></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 form-group>
                <label class="control-label">Product</label>
                <v-select
                  :items="products"
                  v-model="selected_product"
                  item-text="name"
                  item-value="id"
                  placeholder="Type name to search"
                  chips
                  class="pt-0"
                  autocomplete
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                    >
                      <v-avatar>
                        <img :src="data.item.covers[0].cover.url" />
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.covers[0].cover.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.name"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 form-group>
                <label class="control-label">Album Description</label>
                <textarea
                  v-model="album.description"
                  class="album-description form-control non-resizable"
                ></textarea>
              </v-flex>
            </div>
          </v-layout>
        </v-flex>

        <v-flex xs12 class="additional-info-section">
          <div>
            <h4 class="album-info-title">Downloads</h4>
          </div>
          <ul>
            <li>
              To accept payments for downloads, you must
              <span class="blue--text">Connect to Stripe</span> or downloads
              will be disabled
            </li>
            <li>
              The mp3 files you upload will be downloadable for a minimum of
              <span class="black--text">$1.00 per track</span> buyers can choose
              to pay more
            </li>
            <li>
              Key radio & influential DJs will have access to download your
              music for promotional use only.
            </li>
          </ul>
        </v-flex>

        <v-flex
          xs12
          class="additional-info-section"
          v-if="['pending', 'collaborated'].indexOf(album.status) != -1"
        >
          <v-flex xs12>
            <v-layout>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Collaborators</h4>
              </v-flex>
              <v-flex xs12 sm6 pa-0>
                <a @click="learnMore()" class="cancel-button mx-0"
                  >Learn more about album collaborators</a
                >
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex
            xs12
            v-if="album.status == 'pending' && collaborators.length < 3"
          >
            <v-flex xs12 sm6 pa-0>
              <v-btn
                class="add-option-btn ma-0"
                @click.native="addCollaborator()"
              >
                <v-icon>add</v-icon> Add another
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs12 sm6 pa-0>
            <v-layout
              row
              option-content
              v-for="(collaborator, index) in collaborators"
              :key="index"
            >
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Collaborators<label class="required">*</label></label
                >
                <v-select
                  :items="potential_collaborators"
                  v-model="collaborator.user_id"
                  item-text="username"
                  item-value="id"
                  placeholder="Type name to search"
                  chips
                  class="pt-0"
                  no-data-text="No artist found"
                  autocomplete
                  :disabled="album.status != 'pending'"
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi"
                      :key="JSON.stringify(data.item)"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url" />
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Role<label class="required">*</label></label
                >
                <v-select
                  :items="role_types"
                  v-model="collaborator.user_role"
                  placeholder="Type name to search"
                  autocomplete
                  class="pt-0"
                  :disabled="album.status != 'pending'"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm3>
                <label class="control-label">Status</label>
                {{ collaborator.status }}
              </v-flex>
              <v-icon
                class="clear-btn"
                @click="deleteCollaborator(index)"
                v-if="album.status == 'pending'"
                >clear</v-icon
              >
            </v-layout>
          </v-flex>
        </v-flex>

        <v-flex xs12 class="additional-info-section">
          <v-flex xs12>
            <v-layout>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Album Credits</h4>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-flex xs12 sm6 pa-0>
              <v-btn
                class="add-option-btn ma-0"
                @click.native="addContributor()"
              >
                <v-icon>add</v-icon> Add another
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs12 sm6 pa-0>
            <v-layout
              row
              option-content
              v-for="(contirbutor, index) in contributors"
              :key="index"
            >
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Username<label class="required">*</label></label
                >
                <v-select
                  :items="potential_contributors"
                  v-model="contirbutor.user_id"
                  item-text="username"
                  item-value="id"
                  placeholder="Type name to search"
                  chips
                  class="pt-0"
                  no-data-text="No user found"
                  autocomplete
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url" />
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Role<label class="required">*</label></label
                >
                <v-select
                  :items="role_types"
                  v-model="contirbutor.user_role"
                  item-text="name"
                  item-value="name"
                  placeholder="Type name to search"
                  autocomplete
                  class="pt-0"
                ></v-select>
              </v-flex>
              <v-icon class="clear-btn" @click="deleteContributor(index)"
                >clear</v-icon
              >
            </v-layout>
          </v-flex>
        </v-flex>

        <v-flex xs12 class="additional-info-section">
          <v-flex xs12>
            <v-layout>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Sample Used from YouSound</h4>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-flex xs12 sm6 pa-0>
              <v-btn class="add-option-btn ma-0" @click.native="addSampling()">
                <v-icon>add</v-icon> Add another
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex sm12 pa-0>
            <v-layout
              v-for="(sampling, index) in samplings"
              :key="index"
              row
              option-content
            >
              <v-flex xs12 sm3>
                <label class="control-label"
                  >Sampling Track<label class="required">*</label></label
                >
                <v-select
                  v-model="sampling.sampling_track_id"
                  :items="album.tracks"
                  item-text="track.name"
                  item-value="track.id"
                  placeholder="Type name to search"
                  class="pt-0"
                >
                </v-select>
              </v-flex>
              <v-flex xs12 sm3>
                <label class="control-label"
                  >Artist you sampled<label class="required">*</label></label
                >
                <v-select
                  :items="sampling.artists"
                  v-model="sampling.sample_user_id"
                  item-text="username"
                  item-value="id"
                  return-object
                  @change="onChangeSampleArtist"
                  chips
                  class="pt-0"
                  no-data-text="No user found"
                  autocomplete
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url" />
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item == 'object'">
                      <v-list-tile-avatar>
                        <img :src="data.item.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm3>
                <label class="control-label"
                  >Sample<label class="required">*</label></label
                >
                <v-select
                  :items="sampling.artist_albums"
                  v-model="sampling.sample_album_id"
                  item-text="name"
                  item-value="id"
                  placeholder="Type name to search"
                  return-object
                  @change="onChangeSampleArtistAlbum"
                  chips
                  class="pt-0"
                  content-class="menu__content--avatar"
                  no-data-text="No album found"
                  autocomplete
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi"
                    >
                      <v-avatar>
                        <img :src="data.item.cover.thumb.url" />
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item == 'object'">
                      <v-list-tile-avatar>
                        <img :src="data.item.cover.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.name"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm3>
                <label class="control-label"
                  >Track<label class="required">*</label></label
                >
                <v-select
                  :items="sampling.artist_album_tracks"
                  v-model="sampling.sample_track_id"
                  item-text="name"
                  item-value="id"
                  placeholder="Type name to search"
                  autocomplete
                  class="pt-0"
                ></v-select>
              </v-flex>
              <v-icon class="clear-btn" @click="deleteSampling(index)"
                >clear</v-icon
              >
            </v-layout>
          </v-flex>
        </v-flex>

        <v-flex xs12 album-action-section>
          <v-layout row>
            <!-- <v-flex xs12 sm-6>
              <a class="delete-album-btn" @click="deleteAlbum()">Remove Album</a>
            </v-flex> -->
            <v-flex xs12 sm-6>
              <v-btn
                class="release-now-btn"
                flat
                @click.native="beforeReleaseNow()"
                :disabled="!isAvailableToEditAlbum"
                >Release Now</v-btn
              >
              <v-btn
                class="save-for-later-btn"
                flat
                @click.native="saveForLater()"
                v-if="false"
                >Save for later</v-btn
              >
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>

      <v-dialog
        v-model="show_sample_clearance_license_modal"
        content-class="my-dialog-1 large"
      >
        <sample-license-dialog :dismiss="closeSampleClearanceLicenseModal" />
      </v-dialog>

      <v-dialog
        v-model="show_collaborators_confirm_dialog"
        content-class="collaborators-confirm-dialog"
      >
        <v-card>
          <v-card-title class="headline">
            <v-icon>report_problem</v-icon>
            Confirm Collaborators
          </v-card-title>
          <v-card-text>
            Add all of your collaborators, contributors, and/or credit any
            samples used in your album. This allows you to avoid having to
            re-upload your content in case of a dispute.<br /><br />
            If your collaborators don't have an account, have them sign up, then
            visit their profile and invite them to expedite their verification
            proccess. If your collaborators are unable to sign up, you must have
            written permission to upload their content.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="blue--text darken-1"
              flat="flat"
              @click.native="releaseNow()"
              >Ok</v-btn
            >
            <v-btn
              class="blue--text darken-1"
              flat="flat"
              @click.native="hideCollaboratorsConfirmDialog()"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="show_genre_selector_dialog"
        content-class="my-genre-dialog ma-0 pa-2"
      >
        <genre-single-selector :dismiss="closeGenreSelectorDialog" />
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./album_edit.ctrl.js"></script>
