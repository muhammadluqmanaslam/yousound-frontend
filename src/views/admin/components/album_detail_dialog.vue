<template>
  <v-flex xs12 sm12 class="ys-dialog-container">
    <v-layout row wrap class="ys-dialog-dismiss" @click="dismiss()"></v-layout>
    <v-layout row wrap class="ys-dialog ys-album-dialog">
      <v-flex xs3 pr-2>
        <div class="album-cover" :style="{'background-image': 'url(' + album.cover.url + ')'}"/></div>
        <div class="album-info mt-3">
          <v-flex x12 mb-3 py-2 border-top border-bottom>
            <h4>Album Stats</h4>
          </v-flex>
          <v-flex class="album-stats">
            <div><label>Uploaded:</label><span>{{ album.created_at | formatDate }}</span></div>
            <div><label>Plays:</label><span>{{ album.played | formatNumberWithComma }}</span></div>
            <div><label>Reposts:</label><span>{{ album.reposted | formatNumberWithComma }}</span></div>
            <div><label>Downloads:</label><span>{{ album.donwloaded | formatNumberWithComma }}</span></div>
            <div>
              <label>Album only for live video:</label>
              <span v-if="album.is_only_for_live_stream" class="red--text"><b>Yes</b></span>
              <span v-else>No</span>
            </div>
          </v-flex>
          <v-flex x12 mt-4 mb-3 py-2 border-top border-bottom v-if="album_product">
            <h4>Product Attachment</h4>
          </v-flex>
          <v-flex v-if="album_product">
            <v-card>
              <v-layout row>
                <v-flex xs5>
                  <v-card-media :src="album_product.covers[0].cover.thumb.url" contain></v-card-media>
                </v-flex>
                <v-flex xs7>
                  <div>
                    <div class="product-name">{{ album_product.name }}</div>
                    <div class="product-price">${{ album_product.price | formatNumber }}</div>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex x12 mt-3 mb-3 py-2 border-top border-bottom>
            <h4>Contributors</h4>
          </v-flex>
          <v-list subheader two-line>
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
          </v-list>
          <v-flex x12 mt-3 mb-3 py-2 border-top border-bottom v-if="album.collaborators && album.collaborators.length > 0">
            <h4>Collaborators</h4>
          </v-flex>
          <v-list>
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
        </div>
      </v-flex>
      <v-flex xs9 pl-2 border-left>
        <v-flex>
          <label class="album-name">{{ album.name }}</label>
        </v-flex>
        <v-data-table
          :headers="tracks_headers"
          :items="tracks"
          hide-actions
          class="tracks-table"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center"></td>
            <td class="text-xs-center"></td>
          </template>
        </v-data-table>
        <!-- <div class="table-wrapper">
          <table class="tracks-table">
            <thead>
              <tr>
                <th class="text-xs-left">Track Title</th>
                <th class="text-xs-left">Sampled from Yousound</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in tracks">
                <td class="text-xs-left">{{ track.name }}</td>
                <td class="text-xs-center"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div> -->
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript" src="./album_detail_dialog.ctrl.js"></script>
