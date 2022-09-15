<template>
  <div class="page upload-child video-page broadcast-page create-page mx-5">
    <topbarNotification
      :content="topBarContent"
      ctaTitle="Connect"
      :cta="{ name: 'ManageIndex', params: { tab: 'payment' } }"
    />
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li class="active">
            <label v-if="activeView == 'intro'">
              Introduction to YouSound Live
            </label>
            <label class="nav-label" v-if="activeView == 'initStream'">
              <img :src="require('@/assets/up_live.svg')" width="18" class="li-icon">
              Broadcast Live
            </label>
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
              <div>
                <h4 class="info-title">Info</h4>
              </div>

              <div class="form-group">
                <label class="control-label max-char-label">
                  <div>
                    <label class="required">*</label>
                    <span class="__title">Title of Event</span>
                  </div>
                  <span class="max-char">80 char max</span>
                </label>
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
                <label class="control-label max-char-label">
                  <span class="__title">Description</span>
                  <span class="max-char">4000 char max</span>
                </label>

                <textarea
                  class="form-control"
                  v-model="stream.description"
                  maxlength="4000"
                />
              </div>

              <div class="form-group">
                <label class="control-label">
                  <label class="required">*</label>
                  Category
                </label>
                <v-select
                  v-model="stream.genre_id"
                  placeholder="Select"
                  :items="genres"
                  name="genre"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                  hide-details
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
                <label class="control-label">Capacity</label>
                <v-select
                  v-model="stream.viewers_limit"
                  :items="viewers_limits"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                />
              </div>

              <div class="form-group">
                <label class="info-title">Thumbnail</label>

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
                      <div class="cover-wrapper allChildrenCenter">
                        <input
                          type="file"
                          name="stream_cover_file"
                          id="stream_cover_file"
                          accept=".png, .jpg, .jpeg"
                          v-validate="'required'"
                          @change="imageChanged($event)"
                        />

                          <label for="stream_cover_file">
                            <span v-if="stream_cover_url" class="app-blue--text">Change</span>
                            <span v-else class="texet-xs-center dflex align-center justify-center flex-column">
                              <img width="20" src="/static/images/ic_camera.svg" alt="">
                              <span>upload</span>
                            </span>
                          </label>

                        <!-- <label for="stream_cover_file">Upload</label> -->
                        <!-- <span>*PNG, JPG, GIF</span> -->
                      </div>
                    </div>
                  </div>

                  <div v-if="stream_cover_url" class="cover-wrapper mt-2">
                    <input
                      type="file"
                      name="stream_cover_file"
                      class="absolute"
                      id="stream_cover_file"
                      accept=".png, .jpg, .jpeg"
                      v-validate="'required'"
                      @change="imageChanged($event)"
                    />
                    <label for="stream_cover_file">
                      <span class="app-blue--text">Change</span>
                    </label>

                    <!-- <label for="stream_cover_file">Upload</label> -->
                    <!-- <span>*PNG, JPG, GIF</span> -->
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="info-title">Attach Product/Album</label>
                <div class="panel">
                  <v-select
                    v-model="stream_assoc"
                    :items="mergedAttachmentItems"
                    item-text="name"
                    item-value="id"
                    placeholder="Type name to search your products & albums"
                    chips
                    class="pt-0"
                    autocomplete
                    clearable
                  >
                    <template slot="item" slot-scope="data">
                      <v-chip
                        @input="data.parent.selectItem(data.item)"
                        :selected="data.selected"
                        :key="JSON.stringify(data.item)"
                      >
                        <v-avatar>
                          <img v-if="data.item.album_type" :src="data.item.cover.url" />
                          <img v-else :src="data.item.covers[0].cover.url" />
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>

                    <template slot="item" slot-scope="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content
                          v-text="data.item"
                        ></v-list-tile-content>
                      </template>

                      <template v-else>
                        <div class="dflex width100 align-centermy-3">
                          <v-list-tile-avatar>
                            <img v-if="data.item.album_type" :src="data.item.cover.url" />
                            <img v-else :src="data.item.covers[0].cover.url" />
                          </v-list-tile-avatar>

                          <v-list-tile-content class=" py-3">
                            <v-list-tile-title
                              v-html="data.item.name"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </div>
                      </template>
                    </template>
                  </v-select>
                </div>
              </div>

              <div class="form-group">
                <label class="control-label">Feature profiles</label>
                <v-select
                  :items="friends"
                  v-model="stream.account_ids"
                  multiple
                  item-text="name"
                  item-value="id"
                  placeholder="Type name to search people"
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
                        <img v-bind:src="data.item.avatar.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </div>

              <!-- <div class="form-group viewer-support">
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
              </div> -->

              <!-- <div class="form-group">
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
              </div> -->

              <!-- <div class="text-center mt-5">
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

                <v-btn round dark color="blue" class="px-5" type="submit">
                  Create Channel
                </v-btn>
              </div> -->
            </v-flex>
          </v-layout>

          <div class="submit-section">
            <hr class="mb-3" />

            <v-btn 
              round 
              flat 
              class="release-now-btn white--text" 
              type="submit"
            >
              Create Channel
            </v-btn>
          </div>
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
                <label class="creator-name">{{ currentUser.username }}</label>
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
