<template>
  <div class="page upload-child video-page create-page mx-5" v-if="this.currentUser.creator_verified">
    <topbarNotification :content="topBarContent" ctaTitle="Connect" :cta="{ name: 'ManageIndex', params: { tab: 'payment'}}" />
  
    <content-top-header>
      <template slot="topHeader">
        <ul class="pr-3">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            class="nav-li"
            :class="[
              { 'active tab-active': isActiveTab(tab.id) },
              `nav-${tab.id}`,
              { isParent: tab.isParent },
            ]"
          >
            <label class="nav-label" @click="onTab(tab)">
              {{ tab.title }}
              <v-icon v-if="tab.isParent">chevron_right</v-icon>
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content">
        <drag-file-uploader
          accept="video/*"
          type="file"
          category="video"
          @filePicked="pickedFile"
          :autoUpload="true"
          ref="dragFileUploader"
        ></drag-file-uploader>

        <form v-if="videoFile" v-on:submit.prevent="submit()" class="video-info-section">
          <v-layout row>
            <v-flex sm5>
              <div class="mb-4 dflex align-center mt-4">
                <span class="app-bold mr-3 _filename">{{ videoFileName }}</span>
                <span
                  class="red--text app-bold cursor-pointer"
                  @click="deleteAttachedVideo"
                >
                  delete
                </span>
              </div>

              <div>
                <h4 class="info-title">Info</h4>
              </div>

              <div class="form-group">
                <label class="control-label max-char-label">
                  <span class="__title">
                  <label class="required">*</label>
                    Title
                  </span>
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
                  <span class="__title">
                    Description
                  </span>
                  <span class="max-char">4000 char max</span>
                </label>
                <textarea
                  class="form-control"
                  v-model="stream.description"
                  maxlength="4000"
                />
              </div>

              <div class="form-group">
                <label class="control-label max-char-label">
                  <span class="__title">
                  <label class="required">*</label>
                    Category
                  </span>
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
                />
              </div>

              <div class="form-group">
                <label class="info-title">
                    <label class="required">*</label>
                    <span>Video Thumbnail</span>
                </label>

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
                        <label for="stream_cover_file" class="cursor-pointer">
                          <span class="texet-xs-center dflex align-center justify-center flex-column">
                            <img width="20" src="/static/images/ic_camera.svg" alt="">
                            <span>upload</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="cover-wrapper">
                    {{ stream_cover_url ? 'YES' : '' }}
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
                    </label>
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

              <!-- <div class="form-group viewer-support mt-3">
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


              <div class="form-group">
                <label class="info-title">Feature profiles</label>
                <v-select
                  v-model="stream.account_ids"
                  :items="friends"
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

              <!-- <div class="mt-5">
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
                    ></label>
                </p>
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
              :disabled="submitLoading"
            >
              Submit
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
                  v-model="collaborator.user_id"
                  :items="users"
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

<script type="text/javascript" src="./upload.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped>
