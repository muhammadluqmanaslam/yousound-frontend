<template>
  <div class="page video-page manage-page mx-5">
    <content-top-header v-if="isPageReady"
      >>
      <template slot="topHeader">
        <ul class="width100">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: tab.id == active_tab }"
          >
            <label @click="onTab(tab.id)">{{ tab.title }}</label>
          </li>

          <v-spacer></v-spacer>

          <li class="mr-0">
            <v-btn
              depressed
              color="theme--dark red"
              class="cancel-btn"
              @click.native="openStreamDeleteConfirmDialog()"
              >Stop</v-btn
            >
          </li>
          <li class="mr-0">
            <v-btn
              v-if="show_view_stream_button"
              depressed
              dark
              color="green"
              class="view-btn"
              @click.native="viewStream()"
              >Watch / Chat</v-btn
            >
            <v-btn depressed v-else color="grey lighten-2" class="px-4 view-btn"
              >Connecting...</v-btn
            >
          </li>
          <li style="margin-right: -23px">
            <v-btn
              depressed
              dark
              color="blue"
              class="view-btn"
              @click.native.stop="openAddMoreTimeDialog()"
              >Add Time</v-btn
            >
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content" v-if="isPageReady">
        <v-container fluid grid-list-lg px-0>
          <v-layout row wrap>
            <v-flex xs6>
              <div class="app-bold mb-2">Setup Live Broadcast</div>
              <div class="wrapper-info stream-info">
                <!-- <div class="loading" v-if="!isRunning">
                  <i class="fa fa-spinner fa-pulse fa-3x"></i>
                </div> -->
                <div class="divide">
                  Add the <b>URL</b> and <b>Stream Key</b> to your video
                  broadcast Software’s <b>Stream Settings</b>
                </div>
                <div>
                  <label
                    >URL: {{ streamUrl
                    }}<v-btn class="clipboard-btn" v-clipboard:copy="streamUrl">
                      <v-icon>fa-clipboard</v-icon>
                    </v-btn></label
                  >
                </div>
                <div>
                  <label>
                    Stream Key: {{ streamKey }}
                    <v-btn class="clipboard-btn" v-clipboard:copy="streamKey">
                      <v-icon>fa-clipboard</v-icon>
                    </v-btn></label
                  >
                </div>
              </div>
            </v-flex>

            <v-flex sm6>
              <div class="app-bold mb-2">Analytics</div>
              <div class="wrapper-info time-info">
                <v-layout row wrap>
                  <!-- <v-flex sm4>
                    <label>Remaining time</label>
                    <span v-if="currentUser.enabled_live_video_free">--</span>
                    <span v-else>{{ remainingSeconds | timeInHours }}</span>
                  </v-flex> -->
                  <v-flex class="custom-lg5">
                    <label>Broadcast time</label>
                    <span>{{ broadcastSeconds | timeInHours }}</span>
                  </v-flex>
                  <v-flex class="custom-lg5">
                    <label>Watching now</label>
                    <span>{{ active_viewers }}</span>
                  </v-flex>
                  <v-flex class="custom-lg5">
                    <label>Total viewers</label>
                    <span>{{ total_viewers }}</span>
                  </v-flex>
                  <v-flex class="custom-lg5">
                    <label>Repost</label>
                    <span>{{ 0 }}</span>
                  </v-flex>
                  <v-flex class="custom-lg5">
                    <label>Shares</label>
                    <span>{{ 0 }}</span>
                  </v-flex>

                  <p></p>

                  <v-flex class="custom-lg5">
                    <label>Donations</label>
                    <span>${{ 0 }}</span>
                  </v-flex>
                  <v-flex class="custom-lg5">
                    <label>PPV Sales</label>
                    <span>${{ 0 }}</span>
                  </v-flex>
                  <v-flex class="custom-lg5">
                    <label>Follows</label>
                    <span>{{ 0 }}</span>
                  </v-flex>
                  <v-flex xs3>
                    <label>Attachment Views</label>
                    <span>{{ 0 }}</span>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </v-container>

        <v-container fluid grid-list-xs px-0>
        <v-layout wrap row mt-3>
          <v-flex sm12>
            <div class="app-bold mb-2">Broadcast Info</div>

            <div class="wrapper-info detail-info pa-3 mr-3">
              <div class="detail-info-top">
                <div class="mr-3">
                  <b>Details</b>
                </div>
                <div>Edit</div>
              </div>

              <div class="stream-details">
                <div class="stream-bg"></div>
                <div class="stream-info">
                  <h3>Title</h3>

                  <div class="d-flex">
                    <div class="mr-3">
                      <span class="meta-title">Genre:</span>
                      <b>----</b>
                    </div>

                    <div class="mr-3">
                      <span class="meta-title">Cost:</span>
                      <b>----</b>
                    </div>

                    <div class="mr-3">
                      <span class="meta-title">Capacity:</span>
                      <b>----</b>
                    </div>
                  </div>

                  <div>---</div>
                </div>
              </div>

              <div class="divide"></div>

              <div class="feature-info">
                <div class="feature-info-top">
                  <div class="mr-3">
                    <b>Features Profiles</b>
                  </div>
                  <div>Add</div>
                </div>

              <div class="feature-users">
                <div>
                  <v-chip v-for="(u, i) in users" :key="i">
                    {{ u.username }}
                  </v-chip>
                </div>
              </div>
              </div>
            </div>
          </v-flex>

          <v-flex sm6>
            <h4>Attach Product/Album</h4>
            <div class="panel pa-3 mr-3">
              <attach
                v-if="show_view_stream_button"
                v-model="stream_assoc"
                @input="saveAttach()"
                style="width: 100%"
              />
            </div>
          </v-flex>

          <v-flex sm6>
            <h4>Share</h4>
            <div class="panel share-view d-flex pa-3">
              <div class="share-social-section">
                <social-sharing
                  :title="`${currentUser.username} is Broadcasting Live!`"
                  :url="profileUrl"
                  inline-template
                >
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
              </div>
              <div class="input-section">
                <input
                  type="text"
                  class="form-control"
                  v-model="profileUrl"
                  readonly
                />
                <v-btn class="clipboard-btn" v-clipboard:copy="profileUrl">
                  <v-icon>fa-clipboard</v-icon>
                </v-btn>
              </div>
            </div>
          </v-flex>
        </v-layout>
        </v-container>

        <!-- <div class="divider mt-5 mb-5"></div>

        <div>
          <h4 class="mt-0 mb-4">Options</h4>
          <v-flex sm4>
            <label class="control-label">Limit broadcast to how many viewers?</label>
            <v-select
              :items="viewers_limits"
              v-model="viewers_limit"
              item-text="name"
              item-value="id"
              @change="saveViewersLimit"
              class="pt-0"
            />
          </v-flex>
        </div>

        <div class="divider mt-5 mb-5"></div>

        <div>
          <h4 class="mt-0 mb-4">Guest List</h4>
          <v-flex xs12 form-group>
            <v-select
              :items="guests"
              v-model="selected_guests"
              multiple
              cache-items
              chips
              item-text="name"
              item-value="id"
              :search-input.sync="searchGuests"
              @change="saveGuests"
              autocomplete
            ></v-select>
          </v-flex>
        </div> -->

        <v-dialog v-model="show_stream_delete_confirm_dialog">
          <v-card>
            <v-card-title class="headline">Delete a Stream</v-card-title>
            <v-card-text
              >If you click OK, the stream will no longer be available. Click OK
              to delete, or click Cancel.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="red--text darken-1"
                flat
                @click.native="deleteStream()"
                >Ok</v-btn
              >
              <v-btn
                class="green--text darken-1"
                flat
                @click.native="closeStreamDeleteConfirmDialog()"
                >Cancel</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="show_create_failed_dialog">
          <v-card>
            <v-card-title class="headline"
              >Failed in Creating a Stream</v-card-title
            >
            <v-card-text
              >Channel failed to start, you have not been charged. Please try
              again.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="red--text darken-1"
                flat
                @click.native="closeCreateFailedDialog()"
                >Ok</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="show_add_more_time_dialog"
          content-class="add-more-time-dialog"
          v-on-click-outside="closeAddMoreTimeDialog"
        >
          <v-card>
            <v-card-title class="headline"
              >Add more time to your broadcast</v-card-title
            >
            <v-card-text>
              <v-select
                :items="costs"
                v-model="streamCost"
                item-text="name"
                item-value="value"
                class="pt-0"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark round color="blue" @click.native="openPaymentDialog()"
                >Add More Time</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="show_add_more_time_caution_dialog"
          content-class="add-more-time-caution-dialog"
        >
          <v-card class="pa-4">
            <v-card-text>
              You have about<br />
              <b>{{ remainingTime }}</b
              ><br />
              remaining before your broadcast ends.<br />
              Add more time to continue broadcasting.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                dark
                round
                color="blue"
                class="px-4"
                @click.native="closeAddMoreTimeCautionDialog()"
              >
                Close</v-btn
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
    </div>
  </div>
</template>

<script type="text/javascript" src="./manage.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped></style>
