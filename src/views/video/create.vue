<template>
  <div class="page video-page create-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Broadcast</h2>
          <ul class="pr-3">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :class="{ active: tab.id === active_tab }"
            >
              <label @click="!tab.disabled && onTab(tab)">{{
                tab.title
              }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content">
        <form v-on:submit.prevent="openPaymentDialog()">
          <h3 class="mt-3 mb-4">Setup Your Broadcast</h3>

          <v-divider></v-divider>

          <v-layout row class="mt-5">
            <v-flex sm5>
              <div class="form-group">
                <label class="control-label">Title of Event</label>
                <input
                  type="text"
                  class="form-control"
                  name="title"
                  v-model="stream.name"
                  v-validate="'required'"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Pay Per View?</label>
                <v-select
                  :items="view_prices"
                  v-model="stream.view_price"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                />
              </div>

              <div class="form-group">
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
              </div>

              <div class="form-group">
                <label class="control-label">Event Capacity</label>
                <v-select
                  :items="viewers_limits"
                  v-model="stream.viewers_limit"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                />
              </div>

              <div class="form-group">
                <div class="helper-label">
                  <label class="control-label">Spend Limit</label>
                  <v-tooltip left>
                    <div slot="activator">
                      <v-icon>help</v-icon>Cost & Profit Margins
                    </div>
                    <span
                      >The price per min without viewers is $0.058$<br />
                      The price per min per user is $0.005</span
                    ></v-tooltip
                  >
                </div>
                <v-select
                  v-bind:items="costs"
                  v-model="streamCost"
                  item-text="name"
                  item-value="value"
                  class="pt-0"
                />
              </div>

              <div class="text-center mt-5">
                <p class="regular-checkbox ma-0">
                  <input
                    id="terms"
                    type="checkbox"
                    name="terms"
                    v-model="terms"
                    v-validate="'required'"
                  />
                  <label for="terms"
                    >I have read & agree to the
                    <router-link
                      class="forgot-password"
                      to="/terms"
                      target="_blank"
                      >Terms & Conditions</router-link
                    ></label
                  >
                </p>

                <v-btn round dark color="blue" class="px-5" type="submit"
                  >Create Channel</v-btn
                >
              </div>
            </v-flex>

            <v-flex sm7 pl-5>
              <label class="control-label">Thumbnail</label>

              <div class="video-thumbnail-wrapper">
                <div
                  v-if="stream_cover_url"
                  :style="{
                    'background-image': 'url(' + stream_cover_url + ')',
                  }"
                  class="video-thumbnail"
                ></div>
                <div v-else class="video-thumbnail">
                  <!-- <label>PREVIEW</label> -->
                </div>
              </div>

              <div class="cover-wrapper">
                <input
                  type="file"
                  name="stream_cover_file"
                  id="stream_cover_file"
                  accept=".png, .jpg, .jpeg"
                  v-validate="'required'"
                  @change="imageChanged($event)"
                />
                <label for="stream_cover_file">Upload</label>
                <span>*PNG, JPG, GIF</span>
              </div>
            </v-flex>
          </v-layout>
        </form>
      </div>
    </div>

    <v-dialog v-model="show_help_dialog" content-class="my-dialog-2">
      <v-card>
        <v-card-title>
          <v-card-media src="/static/images/post1.jpg" contain></v-card-media>
          <label>Live Video</label>
        </v-card-title>
        <v-card-text>
          <ul>
            <li>
              Attach albums & products to live video to <br />let user
              <b>download</b> or <b>add to cart</b> while viewing.
            </li>
            <li>Make albums & products <b>exclusive</b> on broadcast.</li>
            <li>
              Let users view for <b>Free</b> or <b>Pay Per View</b>.<br />Charge
              up to $10,000 per user.
            </li>
            <li><b>Limit</b> the amount of viewers on your broadcast.</li>
            <li>Add users to your <b>Guest List</b> to watch for free.</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeHelpDialog()"
            class="px-4"
            >Ok, Got it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="show_stripe_connect_dialog"
      content-class="my-dailog-1"
      persistent
    >
      <v-card>
        <v-card-text>
          <div class="headline">Stripe Connect</div>
          <div>You have to connect stripe in setting page.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeStripeConnectDialog()"
            class="px-4"
            >Ok, Got it!</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <payment-modal
      v-if="show_payment_dialog"
      :amount="streamCost"
      :dismiss="closePaymentDialog"
      :finish="deposit"
    />
  </div>
</template>

<script type="text/javascript" src="./create.ctrl.js"></script>
