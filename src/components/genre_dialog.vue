<template>
  <v-container pa-0 class="genre" v-if="isPageReady">
    <h3 class="mt-4 ml-2">Set Genre Filters</h3>
    <p class="ma-2">Only the albums from genres you select will appear on your <strong>Discover & Stream feeds</strong></p>

    <v-btn
      v-if="show_selector_view"
      dark color="blue"
      class="update-btn"
      @click.native="saveGenreFilters()"
    >Save</v-btn>
    <v-layout row wrap mt-3 class="pgs_area" v-if="show_selector_view">
      <div class="pgs-wrapper" v-for="(parent, index) in genres">
        <div class="pgs" :key="parent.id">
          <div class="pgs-inner-wrapper" :class="`bg-color-${index}`" @click="checkParentGenre(parent, !parent.value)">
            <div class="pgs-inner">
              <div class="pgs__title"><label>{{ parent.name }}</label></div>
              <div class="pgs__description">
                <span @click.stop="selectParent(parent, index)">+{{ getSelectedChildrenCount(parent) }} Subgenres</span></div>
              <div class="pgs__content">
                <div class="upload-info">
                  <label>{{ parent.users_size | formatNumberWithComma }}</label>
                  <span>Albums Uploaded</span>
                </div>
                <div v-if="parent.value" class="pgs__badge check-o"></div>
                <div v-else class="pgs__badge check"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-layout>

    <div class="genre-container" v-if="!show_selector_view">
      <div class="pgs-wrapper">
        <div class="pgs" :key="parent.id">
          <div class="pgs-inner-wrapper" :class="`bg-color-${parent_index}`">
            <div class="pgs-inner">
              <div class="pgs__title">{{ parent.name }}</div>
              <div class="pgs__description">+{{ getSelectedChildrenCount(parent) }} Subgenres</div>
              <div class="pgs__content">
                <div class="pgs__badge check-o" v-if="parent.value"></div>
                <div class="pgs__badge check" v-else></div>
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
              <span>({{ child.users_size }})</span>
            </p>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn dark color="blue" class="update-btn" @click.native="show_selector_view = true">OK</v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script type="text/javascript" src="./genre_dialog.ctrl.js"></script>
