<template>
  <div class="main-section">
    <div class="description-section genre">
      <label>Tailor your experience by removing music genres you don't like.</label>
      <label>You will no longer see the selected genres on the site, unless you visit a specific profile, or unhide the genre.</label>
    </div>
    <div class="content-section genre">
      <v-layout row wrap ma-0 v-for="parent in genres" :key="parent.id">
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
      <v-flex xs12 sm12 form-group>
        <v-btn class="update-btn" @click.native="saveGenreFilters()">Save</v-btn>
      </v-flex>
    </div>
  </div>
</template>
<script type="text/javascript" src="./genre_tab.ctrl.js"></script>
