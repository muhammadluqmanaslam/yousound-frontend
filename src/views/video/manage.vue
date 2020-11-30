<template>
  <div class="page video-page manage-page mx-5">
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
              <label @click="onTab(tab)">{{ tab.title }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="isPageReady">
        <h3 class="mt-3 mb-5">
          Add the <b>URL</b> and <b>Stream Key</b> to your video broadcast
          Software’s <b>Stream Settings</b>
        </h3>

        <v-divider></v-divider>

        <v-layout row class="panel time-info mt-5">
          <v-flex sm8>
            <v-layout row>
              <!-- <v-flex sm4>
                <label>Remaining time</label>
                <span v-if="currentUser.enabled_live_video_free">--</span>
                <span v-else>{{ remainingSeconds | timeInHours }}</span>
              </v-flex> -->
              <v-flex sm4>
                <label>Broadcast time</label>
                <span>{{ broadcastSeconds | timeInHours }}</span>
              </v-flex>
              <v-flex sm4>
                <label>Watching now</label>
                <span>{{ active_viewers }}</span>
              </v-flex>
              <v-flex sm4>
                <label>Total viewers</label>
                <span>{{ total_viewers }}</span>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex sm4 class="stream-actions">
            <v-btn
              color="theme--dark red"
              class="cancel-btn"
              @click.native="openStreamDeleteConfirmDialog()"
              >Stop</v-btn
            >
            <v-btn
              v-if="show_view_stream_button"
              dark
              color="green"
              class="view-btn"
              @click.native="viewStream()"
              >Watch</v-btn
            >
            <v-btn v-else color="grey lighten-2" class="px-4 view-btn"
              >Connecting...</v-btn
            >
            <v-btn
              dark
              color="blue"
              class="view-btn"
              @click.native.stop="openAddMoreTimeDialog()"
              >Add Time</v-btn
            >
          </v-flex>
        </v-layout>

        <div class="panel stream-info mt-4">
          <v-flex>
            <!-- <div class="loading" v-if="!isRunning">
              <i class="fa fa-spinner fa-pulse fa-3x"></i>
            </div> -->
            <p>*Put the live video into the stream.</p>
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
          </v-flex>
        </div>

        <v-layout row mt-3>
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
                <social-sharing v-bind:url="profileUrl" inline-template>
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
