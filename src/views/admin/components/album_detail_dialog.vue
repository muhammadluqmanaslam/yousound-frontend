<template>
  <v-flex xs12 sm12 class="ys-dialog-container">
    <v-layout row wrap class="ys-dialog-dismiss" @click="dismiss()"></v-layout>
    <v-layout row wrap class="ys-dialog ys-album-dialog">
      <v-flex xs3 pr-2>
        <div class="album-cover" :style="{'background-image': 'url(' + album.cover.url + ')'}"/></div>
        <v-flex x12 mt-4 mb-3 py-2 border-top border-bottom>
          <h4>Album Info</h4>
        </v-flex>
        <v-flex x12 album-name>
          {{ album.name }}
        </v-flex>
        <v-list subheader two-line>
          <v-subheader>Contributors</v-subheader>
          <v-list-tile :key="user.slug">
            <v-list-tile-avatar class="mr-2">
              <img v-bind:src="user.avatar.url"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="user.display_name"></v-list-tile-title>
              <v-list-tile-sub-title>Uploader</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-if="album.contributors && album.contributors.length > 0"
            v-for="c in album.contributors"
            :key="c.user.slug"
          >
            <v-list-tile-avatar class="mr-2">
              <img v-bind:src="c.user.avatar.url"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="c.user.display_name"></v-list-tile-title>
              <v-list-tile-sub-title v-html="c.user_role"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-subheader v-if="album.collaborators && album.collaborators.length > 0">Collaborators</v-subheader>
          <v-list-tile
            v-if="album.collaborators && album.collaborators.length > 0"
            v-for="c in album.collaborators"
            :key="c.user.slug"
          >
            <v-list-tile-avatar class="mr-2">
              <img v-bind:src="c.user.avatar.url"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="c.user.display_name"></v-list-tile-title>
              <v-list-tile-sub-title v-html="c.user_role"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs9 border-left>
        <v-data-table
          :headers="tracks_headers"
          :items="tracks"
          hide-actions
          class="tracks-table"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center"></td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript" src="./album_detail_dialog.ctrl.js"></script>
