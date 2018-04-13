<template>
  <div class="main-section">
    <div class="description-section genre">
      <label>Tailor your experience by removing music genres you don't like.</label>
      <label>You will no longer see the selected genres on the site, unless you visit a specific profile, or unhide the genre.</label>
    </div>

    <v-container grid-list-lg pa-0 class="content-section genre" v-if="isPageReady">
      <v-layout row wrap ma-0 class="pgs_area" v-if="show_selector_view">
        <div class="pgs-wrapper" v-for="(parent, index) in genres">
          <div class="pgs" :key="parent.id" @click="selectParent(parent, index)">
            <div class="pgs-inner-wrapper" :class="`bg-color-${index}`">
              <div class="pgs-inner">
                <div class="pgs__header">{{ parent.name }}</div>
                <div class="pgs__content">
                  <div class="pgs__image"><i class="fa fa-signal"></i></div>
                  <div class="pgs__badge" v-if="parent.value"><i class="fa fa-check-circle"></i></div>
                  <div class="pgs__badge" v-else-if="getSelectedChildrenCount(parent) > 0"><span :class="`color-${index}`">+{{ getSelectedChildrenCount(parent) }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <v-flex xs12 sm12 form-group>
          <v-btn class="update-btn" @click.native="saveGenreFilters()">Save</v-btn>
        </v-flex>
      </v-layout>

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
                <div class="pgs-inner-wrapper" :class="`bg-color-${parent_index}`">
                  <div class="pgs-inner">
                    <div class="pgs__header">{{ parent.name }}</div>
                    <div class="pgs__content">
                      <div class="pgs__image"><i class="fa fa-signal"></i></div>
                      <div class="pgs__badge" v-if="parent.value"><i class="fa fa-check-circle"></i></div>
                      <div class="pgs__badge" v-else-if="getSelectedChildrenCount(parent) > 0"><span :class="`color-${parent_index}`">+{{ getSelectedChildrenCount(parent) }}</span></div>
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
                  <input :id="parent.id" type="checkbox" v-model="parent.value" @click="checkParentGenre(parent)"/>
                  <label :for="parent.id">Select All</label>
                </p>
              </v-flex>
              <v-flex xs12 sm3 v-for="child in parent.children" :key="child.id">
                <p class="regular-checkbox settings">
                  <input :id="child.id" type="checkbox" v-model="child.value" @click="checkChildGenre(parent, child)"/>
                  <label :for="child.id">{{ child.name }}</label>
                </p>
              </v-flex>
              <v-flex xs12 sm12 form-group>
                <v-btn class="update-btn" @click.native="show_selector_view = true">OK</v-btn>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./genre_tab.ctrl.js"></script>
