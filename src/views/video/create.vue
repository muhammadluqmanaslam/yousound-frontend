<template>
  <div class="page video-page create-page mx-5">
    <topbarNotification :content="topBarContent" ctaTitle="Connect" :cta="{ name: 'ManageIndex', params: { tab: 'payment'}}" />
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li
            class="active"
          >
            <label v-if="activeView == 'intro'">Introduction to YouSound Live</label>
            <label v-if="activeView == 'initStream'">Create Live Event</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <videoEstimate v-if="activeView == 'intro'" @gotoNextView="gotoNextView" />

    <div v-if="activeView == 'initStream'" class="d-flex">
      <div class="page-content">
        <form v-on:submit.prevent="openPaymentDialog()">
          <v-layout row>
            <v-flex sm5>
              <div class="form-group">
                <label class="control-label max-char-label">
                  <span class="__title">Title of Event</span>
                  <span class="max-char">80 char max</span></label>
                <input
                  type="text"
                  class="form-control"
                  name="title"
                  v-model="stream.name"
                  maxlength="80"
                  v-validate="'required'"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Thumbnail</label>

                <div class="video-thumbnail-container">
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
                </div>
              </div>

              <div class="form-group">
                <label class="control-label">Add feature profiles</label>
                <v-select
                  :items="friends"
                  v-model="stream.account_ids"
                  multiple
                  item-text="name"
                  item-value="id"
                  placeholder="Type name to search"
                  chips
                  class="pt-0"
                  autocomplete
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.url" />
                      </v-avatar>
                      {{ data.item.display_name }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.display_name"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </div>

              <div class="form-group viewer-support">
                <label class="control-label">Allow viewer support</label>
                <ul>
                  <li>
                    Upload a small file to include anything from music to videos
                  </li>
                  <li>
                    Your viewers will be able to pay $1, $10, $100, or name
                    their own price for this file.
                  </li>
                  <li>
                    File is only available for the duration of the broadcast &
                    downloadable on direct message
                  </li>
                </ul>
                <digital-uploader
                  :digitalContent="digital_content"
                  accept=".zip, .mp3"
                />
              </div>

              <div class="form-group">
                <label class="control-label"
                  >Pay Per View?
                  <a @click.stop="openCollaboratorsDialog()">change</a>
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="view_price"
                  :value="stream_view_price"
                  disabled
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

              <div class="form-group">
                <label class="control-label"
                  >Description<span>160 char max</span></label
                >
                <textarea
                  class="form-control"
                  v-model="stream.description"
                  maxlength="160"
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

    <v-dialog
      v-model="show_collaborators_dialog"
      content-class="stream-collaborators-dialog"
      persistent
    >
      <v-card>
        <v-card-title
          ><div class="headline">
            Collaborators Pay Per View Split
          </div></v-card-title
        >
        <v-card-text>
          <div>
            <div>
              <v-select
                :items="view_prices"
                v-model="stream.view_price"
                v-validate="'required'"
                item-text="name"
                item-value="id"
                class="pt-0"
              />
            </div>

            <div
              v-if="stream.view_price > 0 && stream.collaborators.length < 3"
            >
              <v-btn
                class="add-option-btn ma-0"
                @click.native="addCollaborator()"
              >
                <v-icon>add</v-icon> Add another collaborator
              </v-btn>
            </div>

            <v-layout
              row
              creator-wrapper
              v-if="stream.collaborators && stream.collaborators.length > 0"
            >
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Creator<span class="required">*</span></label
                >
                <label class="creator-name">{{
                  currentUser.display_name
                }}</label>
              </v-flex>
              <v-flex xs6 sm3>
                <label class="control-label"
                  >Profit Share<span class="required">*</span></label
                >
                <label class="creator-share">{{ creator_share }}</label>
              </v-flex>
              <v-flex xs6 sm3>
                <label class="control-label">Recoup Cost</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="stream.creator_recoup_cost"
                />
              </v-flex>
            </v-layout>
            <v-layout
              row
              collaborator-wrapper
              v-for="(collaborator, index) in stream.collaborators"
              :key="index"
            >
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Collaborators<span class="required">*</span></label
                >
                <v-select
                  :items="users"
                  v-model="collaborator.user_id"
                  item-text="username"
                  item-value="id"
                  chips
                  class="pt-0"
                  autocomplete
                  no-data-text="No collaborator available"
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                      class="chip--select-multi"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url" />
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
                <!-- <input type="text" class="form-control" v-model="collaborator.user_id"> -->
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Profit Share<span class="required">*</span></label
                >
                <v-select
                  v-bind:items="profit_share_types"
                  v-model="collaborator.user_share"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                  autocomplete
                ></v-select>
              </v-flex>
              <v-icon class="clear-btn" @click="deleteCollaborator(index)"
                >clear</v-icon
              >
            </v-layout>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeCollaboratorsDialog()"
            class="px-4"
            >OK</v-btn
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
<style src="../../../static/styles/video.scss" lang="scss" scoped>
