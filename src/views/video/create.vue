<template>
  <div class="page video-page create-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <h2 class="page-title">Live Video</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <form v-on:submit.prevent="openPaymentDialog()">
        <v-layout row>
          <v-flex sm4>
            <div class="my-card">
              <div class="o-out blue0"><div class="o-in"></div></div>
              <div class="my-card__title">Step 1:</div>
              <div class="my-card__subtitle">Download Video Broadcast Software</div>
              <div class="my-card__text">Download video streaming software like a free version of <a href="https://obsproject.com/" target="_blank">OBS</a>. Here are <a href="https://support.yousound.com/article/271-how-do-i-setup-a-live-video-broadcast" target="_blank">links to more</a></div>
            </div>
          </v-flex>
          <v-flex sm4>
            <div class="my-card">
              <div class="o-out red0"><div class="o-in"></div></div>
              <div class="my-card__title">Step 2:</div>
              <div class="my-card__subtitle">Prepare your live stream</div>
              <div class="my-card__text">Make sure your live video stream looks good on your computer before proceeding to Step 3.</div>
            </div>
          </v-flex>
          <v-flex sm4>
            <div class="my-card">
              <div class="o-out green0"><div class="o-in"></div></div>
              <div class="my-card__title">Step 3:</div>
              <div class="my-card__subtitle">Pay for what you use</div>
              <div class="my-card__text">Pay per hour.  After payment, you will receive your stream key.</div>
            </div>
          </v-flex>
        </v-layout>

        <div class="divider mt-3 mb-4"></div>

        <v-layout row>
          <v-flex sm8>
            <h3 class="mb-4">Broadcast Info</h3>
            <v-layout row>
              <v-flex xs5>
                <v-flex xs12 form-group>
                  <label class="control-label">Title of stream?</label>
                  <input type="text" class="form-control" name="title" v-model="stream.name" v-validate="'required'">
                </v-flex>
                <v-flex xs12>
                  <label class="control-label">Genre</label>
                  <v-select
                    :items="genres"
                    v-model="stream.genre_id"
                    name="genre"
                    v-validate="'required'"
                    item-text="name"
                    item-value="id"
                    class="pt-0"
                  />
                </v-flex>
              </v-flex>

              <v-flex xs5 ml-3>
                <v-flex xs12 form-group>
                  <label class="control-label">Pay Per View?</label>
                  <v-select
                    :items="view_prices"
                    v-model="stream.view_price"
                    v-validate="'required'"
                    item-text="name"
                    item-value="id"
                    class="pt-0"
                  />
                </v-flex>
                <v-flex xs12>
                  <label class="control-label">Duration</label>
                  <v-select
                    v-bind:items="periods"
                    v-model="period"
                    item-text="name"
                    item-value="id"
                    class="pt-0"
                  />
                </v-flex>
              </v-flex>
            </v-layout>
            <v-layout row wrap cover-wrapper>
              <v-flex xs12 my-3 cover-title>
                <label>Upload Cover</label>
                <span class="ml-2 px-1">*600x600px</span>
              </v-flex>
              <v-flex xs12 cover-actions>
                <!-- <v-btn dark round color="red lighten-1" class="px-2">Upload</v-btn> -->
                <input
                  type="file"
                  name="stream_cover_file"
                  id="stream_cover_file"
                  accept="image/*"
                  v-validate="'required'"
                  @change="imageChanged($event)"
                >
                <label for="stream_cover_file" class="red lighten-1 white--text px-4 py-2">Upload</label>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex sm4>
            <h3 class="mb-4">Preview</h3>
            <v-card class="user-preview">
              <v-card-media
                contain
                :src="currentUser.avatar.thumb.url"
              ></v-card-media>
              <v-card-title class="ml-2">
                <div>
                  <div class="user-name">{{ currentUser.display_name }}</div>
                  <div class="user-type">{{ currentUser.user_type }}</div>
                </div>
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-btn dark color="red lighten-1">Live</v-btn>
              </v-card-actions>
            </v-card>
            <v-card class="video-preview mt-3">
              <v-card-media
                cover
                :src="stream_cover_url"
              ></v-card-media>
              <v-card-title class="ml-3">
                <div>
                  <div class="video-name mt-1">{{ stream.name | truncateInMiddle(25) }}</div>
                  <div class="video-period mt-1">00:16:52</div>
                </div>
                <div class="video-owner-name">{{ currentUser.display_name }}</div>
                <div class="video-price mb-2">
                  <v-btn fab small dark color="grey lighten-2" class="ma-0"><v-icon>fa-dollar</v-icon></v-btn>
                  <label v-if="stream.view_price > 0" class="ml-2">${{ stream.view_price | formatNumber }}</label>
                  <label v-else class="ml-2">Free</label>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>

        <div class="divider mt-3 mb-5"></div>

        <v-layout row>
          <v-flex sm8 form-group mr-4>
            <div class="comment-box">
              After clicking <b>“Create Channel”</b>, it can take up to <b>5 minutes</b> to generate your Stream Key.<br/>
              It costs $10 per hour to live video broadcast & you can purchase up to 24 hours.<br/>
              Any unused time is rolled over to your next broadcast.
            </div>
          </v-flex>
          <v-flex sm4>
            <div class="button-wrapper text-center">
              <v-btn round dark color="blue" class="px-5" type="submit">Create Channel</v-btn>
              <p class="regular-checkbox ma-0">
                <input id="terms" type="checkbox" name="terms" v-model="terms" v-validate="'required'"/>
                <label for="terms">I have read & agree to the <router-link class="forgot-password" to="/terms" target="_blank">Terms & Conditions</router-link></label>
              </p>
            </div>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>

    <payment-modal
      v-if="show_payment_dialog"
      :type="''"
      :amount="streamCost"
      :dismiss="closePaymentDialog"
      :finish="deposit"
    />
  </div>
</template>

<script type="text/javascript" src="./create.ctrl.js"></script>
