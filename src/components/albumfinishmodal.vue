<template>
  <v-flex xs12 sm12 class="album-finish-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 class="title-section">
        <label class="title-text"
          >Your album has been released,
          <router-link to="/upload/album" class="link-text"
            >upload another</router-link
          ></label
        >
      </v-flex>
      <v-flex xs12 class="promote-album-section" v-if="false">
        <v-flex xs12 class="header-section">
          <label class="header-text">Promote your album</label>
        </v-flex>
        <div class="content-section">
          <div class="promote-album-image">
            <!-- <img id="promote_album_image" /> -->
            <div
              class="promote-image"
              :style="{ 'background-image': 'url(' + itemCover + ')' }"
            ></div>
            <img src="/static/images/promote_frame.png" />
          </div>
          <div class="promote-album-description">
            <label>
              Reach your target audience<br />
              Easily filter users by price, number of followers, user type<br />
              Set your potential reach & measure speicfic engagement<br />
              Favorite your best reposters for your next release.
            </label>
            <v-btn class="promote-btn" flat @click.native="showPromoteModal()"
              >Promote this album</v-btn
            >
          </div>
          <div class="promote-album-action"></div>
        </div>
      </v-flex>
      <v-flex xs12 class="album-section">
        <v-card>
          <v-container pa-4 fluid>
            <v-layout row>
              <v-flex xs5>
                <v-card-media
                  :src="item.cover.url"
                  height="270px"
                  contain
                ></v-card-media>
              </v-flex>
              <v-flex xs7>
                <div class="card__content">
                  <div class="album-name pt-2">{{ item.name }}</div>
                  <div class="album-artist-name">
                    {{ item.user.display_name }}
                  </div>
                  <div class="album-tracks-count">
                    {{ item.tracks.length }} tracks
                  </div>
                  <div class="attachment" v-if="itemProduct">
                    <h3 class="pt-3 pb-2">
                      <v-icon right>attach_file</v-icon> Attachment
                    </h3>
                    <v-card>
                      <v-container pa-0 fluid>
                        <v-layout row>
                          <v-flex xs3>
                            <v-card-media
                              :src="itemProduct.covers[0].cover.thumb.url"
                              height="90px"
                              contain
                            ></v-card-media>
                          </v-flex>
                          <v-flex xs9>
                            <div class="card__content">
                              <div class="product-name">
                                {{ itemProduct.name }}
                              </div>
                              <div class="product-price">
                                ${{ itemProduct.price | formatNumber }}
                              </div>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12 px-4 class="item-section">
        <v-flex xs12 class="header-section">
          <label class="header-text pb-1">View & Share your album</label>
        </v-flex>
        <div class="album-detail-section pt-3 pb-4">
          <router-link class="album-link" :to="albumURL">{{
            albumURL
          }}</router-link>
          <v-flex xs12 class="share-social-section">
            <v-btn class="social-share-btn ml-0"
              ><v-icon>fa-envelope</v-icon></v-btn
            >
            <social-sharing v-bind:url="albumURL" inline-template>
              <div class="social-section">
                <network network="facebook">
                  <!-- <i class="fa fa-fw fa-facebook"></i> Facebook -->
                  <v-btn class="social-share-btn"
                    ><v-icon>fa-facebook</v-icon></v-btn
                  >
                </network>
                <network network="twitter">
                  <!-- <i class="fa fa-fw fa-twitter"></i> Twitter -->
                  <v-btn class="social-share-btn"
                    ><v-icon>fa-twitter</v-icon></v-btn
                  >
                </network>
              </div>
            </social-sharing>
            <div class="input-section">
              <input
                type="text"
                class="form-control"
                v-model="albumURL"
                readonly
              />
              <v-btn
                class="clipboard-btn"
                v-clipboard:copy="albumURL"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <v-icon>fa-clipboard</v-icon>
              </v-btn>
            </div>
          </v-flex>
        </div>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
import _ from 'lodash'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    promote: {
      type: Function,
      required: true,
    },
    dismiss: {
      type: Function,
      required: true,
    },
  },

  components: {},

  data() {
    return {
      showPromoteMessage: false,
      albumURL: '',
    }
  },

  computed: {
    itemProduct() {
      return _.get(this.item, 'products[0]')
    },

    itemCover() {
      if (this.item.slug) {
        return this.item.cover.url
      } else {
        var coverURL = ''
        for (let index in this.item.covers) {
          const cover = this.item.covers[index].cover
          if (cover.url) {
            coverURL = cover.url
            break
          }
        }
        return coverURL
      }
    },
  },

  created() {
    if (this.item.slug) {
      this.albumURL = window.location.origin + '/album/' + this.item.slug
    } else {
      this.albumURL = window.location.origin + '/product/' + this.item.id
    }
  },

  methods: {
    showPromoteModal() {
      this.promote()
    },

    onCopy: function (e) {
      this.$store.dispatch('error/showSuccessToast', [
        'You just copied: ' + e.text,
      ])
      // alert('You just copied: ' + e.text)
    },

    onError: function (e) {
      this.$store.dispatch('error/showErrorToast', ['Failed to copy link'])
      // alert('Failed to copy link')
    },
  },
}
</script>
