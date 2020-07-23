<template>
  <div class="main-section">
    <div class="description-section genre">
      <label
        >Tailor your experience by removing music genres you don't like.</label
      >
      <label
        >You will no longer see the selected genres unless you visit a specific
        profile, or unhide the genre.</label
      >
    </div>

    <div>
      <v-container
        grid-list-lg
        pa-0
        class="content-section genre"
        v-if="isPageReady"
      >
        <v-layout row wrap ma-0 class="pgs_area" v-if="show_selector_view">
          <div class="pgs-wrapper" v-for="(parent, index) in genres">
            <div class="pgs" :key="parent.id">
              <div
                class="pgs-inner-wrapper"
                :class="`bg-color-${index}`"
                @click="checkParentGenre(parent, !parent.value)"
              >
                <div class="pgs-inner">
                  <div class="pgs__title">
                    <label>{{ parent.name }}</label>
                  </div>
                  <div class="pgs__description">
                    <span @click.stop="selectParent(parent, index)"
                      >+{{ getSelectedChildrenCount(parent) }} Subgenres</span
                    >
                  </div>
                  <div class="pgs__content">
                    <div class="upload-info">
                      <label>{{
                        parent.users_size | formatNumberWithComma
                      }}</label>
                      <span>Album Uploaded</span>
                    </div>
                    <div v-if="parent.value" class="pgs__badge check-o"></div>
                    <div v-else class="pgs__badge check"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="actions-wrapper">
            <!-- <v-btn dark round color="blue" @click.native="openLoadGenreConfirmDialog()">Load Preset</v-btn> -->
            <v-btn dark round color="blue" @click.native="saveGenreFilters()"
              >Save</v-btn
            >
          </div>
        </v-layout>
      </v-container>

      <!-- <div class="content-section genre" v-if="!show_selector_view">
        <template v-for="parent in genres">
          <v-layout row wrap ma-0 :key="parent.id">
            <v-flex xs12 sm12 pa-0 pt-3>
              <p class="regular-checkbox settings parent-genre">
                <input :id="parent.id" type="checkbox" v-model="parent.value" @click="checkParentGenre(parent)"/>
                <label :for="parent.id">{{ parent.name }}</label>
              </p>
            </v-flex>
            <v-flex xs12 sm2 form-group v-for="child in parent.children" :key="child.id">
              <p class="regular-checkbox settings">
                <input :id="child.id" type="checkbox" v-model="child.value" @click="checkChildGenre(parent, child)"/>
                <label :for="child.id">{{ child.name }}</label>
              </p>
            </v-flex>
          </v-layout>
        </template>
      </div> -->

      <div class="content-section genre" v-if="!show_selector_view">
        <div class="genre-container">
          <div class="genre__header">
            <div class="pgs-wrapper">
              <div class="pgs" :key="parent.id">
                <div
                  class="pgs-inner-wrapper"
                  :class="`bg-color-${parent_index}`"
                >
                  <div class="pgs-inner">
                    <div class="pgs__title">{{ parent.name }}</div>
                    <div class="pgs__description">
                      +{{ getSelectedChildrenCount(parent) }} Subgenres
                    </div>
                    <div class="pgs__content">
                      <div class="pgs__badge check-o" v-if="parent.value"></div>
                      <div class="pgs__badge check" v-else></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="genre__content">
            <v-layout row wrap ma-0 :key="parent.id">
              <v-flex xs12 sm12>
                <p class="regular-checkbox settings parent-genre">
                  <input
                    :id="parent.id"
                    type="checkbox"
                    v-model="parent.value"
                    @click="checkParentGenre(parent)"
                  />
                  <label :for="parent.id">Select All</label>
                </p>
              </v-flex>
              <v-flex xs12 sm3 v-for="child in parent.children" :key="child.id">
                <p class="regular-checkbox settings">
                  <input
                    :id="child.id"
                    type="checkbox"
                    v-model="child.value"
                    @click="checkChildGenre(parent, child)"
                  />
                  <label :for="child.id">{{ child.name }}</label>
                  <span>({{ child.users_size }})</span>
                </p>
              </v-flex>
            </v-layout>
          </div>
        </div>
        <v-btn
          dark
          color="blue"
          class="update-btn"
          @click.native="show_selector_view = true"
          >OK</v-btn
        >
      </div>

      <v-dialog
        v-model="show_load_genre_confirm_dialog"
        content-class="my-dialog-1"
      >
        <v-card>
          <v-card-text>
            <div class="headline">Save current genre setting?</div>
            <div>You can save current genre setting and load it later</div>
            <v-layout pt-3>
              <v-flex xs2 class="d-flex">
                <label class="text-xs-left">Name</label>
              </v-flex>
              <v-flex xs10 class="d-flex">
                <input v-model="preset_name" type="text" class="py-1 px-2" />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn dark color="green" @click.native="savePreset()">Yes</v-btn>
            <v-btn
              dark
              color="grey"
              @click.native="closeLoadGenreConfirmDialog()"
              >No</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="show_load_genre_dialog"
        content-class="my-dialog-1"
        v-on-click-outside="closeLoadGenreDialog"
      >
        <v-card>
          <v-card-text>
            <div class="headline">Load Genre</div>
            <v-list>
              <template v-for="(preset, index) in presets">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ preset.name }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <div>
                      <v-btn
                        icon
                        small
                        class="mr-2"
                        @click.native="removePreset(preset.id)"
                      >
                        <v-icon color="red">fa-trash</v-icon>
                      </v-btn>
                      <v-btn icon small @click.native="loadPreset(preset.id)">
                        <v-icon color="blue">fa-download</v-icon>
                      </v-btn>
                    </div>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider
                  v-if="index + 1 < presets.length"
                  :key="preset.id"
                ></v-divider>
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn dark color="grey" @click.native="closeLoadGenreDialog()"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script type="text/javascript" src="./genre_tab.ctrl.js"></script>
