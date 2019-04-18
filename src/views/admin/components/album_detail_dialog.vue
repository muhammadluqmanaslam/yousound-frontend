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
            <v-list-tile>
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
              v-for="(c, index) in album.contributors"
              :key="`contributor-${index}`"
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
              v-for="(c, index) in album.collaborators"
              :key="`collaborator-${index}`"
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
        <!-- <v-data-table
          :headers="tracks_headers"
          :items="tracks"
          hide-actions
          class="tracks-table"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center"></td>
            <td class="text-xs-center">{{ props.item.played }}</td>
            <td class="text-xs-center"></td>
          </template>
        </v-data-table> -->
        <div class="table-wrapper">
          <table class="tracks-table">
            <thead>
              <tr>
                <th class="text-xs-left">Track Title</th>
                <th class="text-xs-left">Sampled from Yousound</th>
                <th class="text-xs-left">Played</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in tracks">
                <td class="text-xs-left">{{ track.name }}</td>
                <td class="text-xs-center">
                  <span
                    v-if="isSampledTrack(track.id)"
                    @click="show_album_credit_dialog=true"
                    class="album_credit-btn"
                  >Yes</span>
                </td>
                <td>{{ track.played }}</td>
                <td>
                  <v-btn
                    dark small
                    color="red"
                    class="remove-btn"
                  ><v-icon>delete</v-icon></v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="show_album_credit_dialog"
      scrollable
      max-width="600px"
      class="album-credits-dialog"
    >
      <v-card
        v-if="show_album_credit_dialog"
        class="album-dialog-body"
      >
        <v-card-title>Album Credits</v-card-title>
        <v-btn
          @click.native="show_album_credit_dialog=false"
          class="dialog-close-btn"
        ><v-icon>highlight_off</v-icon></v-btn>
        <v-card-text style="height: 300px;">
          <v-flex xs12 sm12>
            <label class="album-info-label">Album Name: </label>
            <label class="album-info-text">{{ album.name }}</label>
          </v-flex>
          <v-flex xs12 sm12>
            <label class="album-info-label">Release Date: </label>
            <label class="album-info-text">{{ album.released_at | formatDate }}</label>
          </v-flex>
          <v-flex xs12 sm12 v-if="album.location && album.location!=''">
            <label class="album-info-label">Location: </label>
            <label class="album-info-text">{{ album.location }}</label>
          </v-flex>
          <v-flex xs12 sm12>
            <label class="album-info-label">Genre: </label>
            <label class="album-info-text">{{ genres }}</label>
          </v-flex>
          <v-flex xs12 sm12 v-if="album.collaborators && album.collaborators.length > 0">
            <label class="album-info-label">Collaborators: </label>
            <label class="album-info-text">
              <template v-for="c in album.collaborators">
                <div class="collaborator-info">
                  <router-link class="user-name" :to="`/${c.user.slug}`">{{ c.user.display_name }}</router-link> - {{ c.user_role }}</div>
              </template>
            </label>
          </v-flex>
          <v-flex xs12 sm12>
            <label class="album-info-label">Contributors: </label>
            <label class="album-info-text">
              <div class="contributor-info">
                <router-link class="user-name" :to="`/${album.user.slug}`">{{ album.user.display_name }}</router-link> - Uploader</div>
            </label>
            <label class="album-info-text" v-if="album.contributors && album.contributors.length > 0">
              <template v-for="c in album.contributors">
                <div class="contributor-info">
                  <router-link class="user-name" :to="`/${c.user.slug}`">{{ c.user.display_name }}</router-link> - {{ c.user_role }}</div>
              </template>
            </label>
          </v-flex>
          <v-flex xs12 sm12 v-if="album.samplings && album.samplings.length > 0">
            <label class="album-info-label">Samples: </label>
            <label class="album-info-text" v-if="album.samplings && album.samplings.length > 0">
              <template v-for="s in album.samplings">
                <div class="sampling-info">
                  <label>{{ s.sampling_track.name }}</label>:&nbsp;<router-link class="user-name" :to="`/${s.sample_user.slug}`">{{ s.sample_user.display_name }}</router-link>
                  <span> - {{ s.sample_track.name }}</span>
                </div>
              </template>
            </label>
          </v-flex>
          <v-flex xs12 sm12 v-if="album.labels && album.labels.length > 0">
            <label class="album-info-label">Label: </label>
            <label class="album-info-text">
              <router-link class="user-name" :to="`/${album.labels[0].user.slug}`">{{ album.labels[0].user.display_name }}</router-link>
            </label>
          </v-flex>
          <v-flex xs12 sm12>
            <div class="album-info-label">About the album: </div>
            <label class="album-info-text">{{ album.description }}</label>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script type="text/javascript" src="./album_detail_dialog.ctrl.js"></script>
