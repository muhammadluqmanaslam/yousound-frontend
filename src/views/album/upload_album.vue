<template>
  <div class="page upload-child upload-album-page" v-if="this.currentUser.creator_verified">
    <div v-if="isPageReady">
      <content-top-header>
        <template slot="topHeader">
          <ul class="pr-3">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              class="nav-li"
              :class="[
                { 'active tab-active': isActiveTab(tab.id) },
                `nav-${tab.id}`,
                { isParent: tab.isParent },
              ]"
            >
              <label class="nav-label" @click="onTab(tab)">
                {{ tab.title }}
                <v-icon v-if="tab.isParent">chevron_right</v-icon>
              </label>
            </li>
          </ul>
        </template>
      </content-top-header>

      <div>
        <track-uploader
          accept=".mp3"
          :autoUpload="true"
          :album="album"
        ></track-uploader>
      </div>

      <div
        v-if="album.tracks.length"
        class="album-info-section mx-5"
        id="album_info_section"
      >
        <div>
          <h4 class="album-info-title">Info</h4>
        </div>

        <v-container fluid grid-list-lg px-0 album-section>
          <v-layout wrap row album-content-section>
            <v-flex xs12 sm3 form-group>
              <label class="control-label">
                <label class="required">*</label>
                Album Title
                </label>
              <input type="text" class="form-control" v-model="album.name" />
            </v-flex>

            <v-flex xs12 sm3 form-group>
              <label class="control-label">
                <label class="required">*</label>
                Genre
                </label>
              <input
                :value="$store.getters['genreSelector/genre'].name"
                @click="openGenreSelectorDialog()"
                type="text"
                class="form-control"
                readonly
              />
              <!-- <v-select
                v-bind:items="genres"
                item-value="id"
                item-text="name"
                v-model="album.genre"
                class="pt-0"
                no-data-text="No genres found"
                autocomplete
              /> -->
            </v-flex>

            <v-flex xs12 sm3 form-group>

              <label class="control-label">
                <label class="required">*</label>
                  Released Date
                </label>
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
                  readonly
                ></v-text-field>
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

            <v-flex xs12 sm3 form-group>
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

            <v-flex xs12>
              <v-container fluid grid-list-lg px-0>
                <v-layout wrap row>
                  <v-flex xs12 sm2>


                  <label class="control-label">
                    <label class="required">*</label>
                    Album cover
                  </label>

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
                            <v-icon class="camera">photo_camera</v-icon>upload
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
                    </div>
                  </v-flex>

                  <v-flex xs12 sm10 form-group pb-3>
                    <label class="control-label">Description</label>
                    <textarea
                      v-model="album.description"
                      class="album-description form-control non-resizable"
                    ></textarea>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>

            <v-flex xs12 form-group>
              <label class="control-label">
                Live stream only
              </label>
              <div>
                <v-checkbox
                  v-model="album.is_only_for_live_stream"
                >
                <template slot="label">
                  <span class="black--text">
                    Check box if album is available for <b>live stream only</b>
                  </span>
                </template>
                </v-checkbox>
              </div>
            </v-flex>

            <v-flex xs12 form-group>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Album Includes</h4>
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
            </v-flex>

            <v-flex xs12 form-group>
              <v-flex xs12 sm6 pa-0>
                <h4 class="album-info-title">Attach product to album</h4>
                <v-select
                  v-bind:items="products"
                  v-model="selected_product"
                  item-text="name"
                  item-value="id"
                  placeholder="Type name to search your product"
                  chips
                  class="pt-0"
                  no-data-text="No products found"
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
                        <img :src="data.item.covers[0].cover.thumb.url" />
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
                        <img v-bind:src="data.item.covers[0].cover.thumb.url" />
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
            </v-flex>

            <v-flex xs12 class="additional-info-section">
              <v-flex xs12 sm6 pa-0>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs12 sm6 dflex align-center pa-0 mb-2>
                      <h4 class="album-info-title mb-0 mr-2">Collaborators ({{ collaborators.length }})</h4>
                      <v-btn
                        v-if="collaborators.length < 3"
                        class="add-option-btn ma-0"
                        @click.native="addCollaborator()"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 pa-0>
                  <v-layout
                    row
                    option-content
                    v-for="(collaborator, index) in collaborators"
                    :key="index"
                  >
                    <v-flex xs12 sm6>
                      <label class="control-label">Collaborator</label>
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
                    
                    <v-flex xs12 sm6 mb-4>
                      <label class="control-label">Role</label>
                      <span class="dflex align-center">
                        <v-select
                          v-bind:items="role_types"
                          v-model="collaborator.user_role"
                          item-text="name"
                          item-value="name"
                          placeholder="Type name to search"
                          class="pt-0"
                          autocomplete
                        ></v-select>

                      <v-icon 
                        class="clear-btn" 
                        @click="deleteCollaborator(index)"
                      >
                        clear
                      </v-icon>
                      </span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-flex>
            </v-flex>

            <v-flex xs12 class="additional-info-section">
              <v-flex xs12 sm6 pa-0>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs12 sm6 dflex align-center pa-0 mb-2>
                      <h4 class="album-info-title mb-0 mr-2">Album Credits ({{ contributors.length }})</h4>
                      <v-btn
                        class="add-option-btn ma-0"
                        @click.native="addContributor()"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 pa-0>
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
                      <span class="dflex align-center">
                        <v-select
                          :items="role_types"
                          v-model="contirbutor.user_role"
                          item-text="name"
                          item-value="name"
                          placeholder="Type name to search"
                          class="pt-0"
                          autocomplete
                        ></v-select>
                        <v-icon
                          class="clear-btn" 
                          @click="deleteContributor(index)"
                        >
                          clear
                        </v-icon>
                      </span>
                      </v-flex>
                  </v-layout>
                </v-flex>
              </v-flex>
            </v-flex>

            <!-- <v-flex xs12 form-group enabled-sample-wrapper>
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
                <v-radio value="`false`" label="No" light></v-radio>
                <v-radio value="`true`" label="Yes" light></v-radio>
              </v-radio-group>
            </v-flex> -->
          </v-layout>
        </v-container>

        <v-flex xs12 class="additional-info-section">
          <div>
            <h4 class="album-info-title">Downloads</h4>
          </div>
          <ul>
            <li>
            All tracks are $1.00 by default, to accept payments for downloads, you must 
            <router-link :to="{ name: 'ManageIndex', params: { tab: 'payment' } }">Connect to Stripe</router-link>
             or downloads will be disabled
            </li>
            <!-- <li>
              To sell an album and limit tracks, only upload free tracks you want listeners to stream, then connect your digital product to the album
            </li> -->
          </ul>
        </v-flex>

        <!-- <v-flex xs12 class="additional-info-section">
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
                  placeholder="Type name to search"
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
        </v-flex> -->

        <v-flex xs12 album-action-section>
          <v-layout row>
            <!-- <v-flex xs12 sm-6>
              <a class="delete-album-btn" @click="deleteAlbum()">Remove Album</a>
            </v-flex> -->
            <v-flex xs12 sm-6 text-xs-left>
              <v-btn
                class="release-now-btn white--text"
                flat
                @click.native="beforeReleaseNow()"
                :disabled="!isAvailableToUploadAlbum"
                >Submit</v-btn
              >
              <v-btn
                v-if="false"
                class="save-for-later-btn"
                flat
                @click.native="saveForLater()"
                >Save for later</v-btn
              >
            </v-flex>
          </v-layout>
        </v-flex>
      </div>
    </div>

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
          Add all of your collaborators, contributors, and/or credit any samples
          used in your album. This allows you to avoid having to re-upload your
          content in case of a dispute.<br /><br />
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
  </div>
</template>

<script type="text/javascript" src="./upload_album.ctrl.js"></script>
<style scoped src="../../../static/styles/album.scss" lang="scss"></style>
