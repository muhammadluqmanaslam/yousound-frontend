<template>
  <div class="page video-page index-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <h2 class="page-title">Live Video</h2>
      <p class="page-subtitle mt-5 mb-4">It can take up to 5 mins to get your stream keys, get ready to broadcast!</p>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 v-if="isPageReady">
      <v-layout row>
        <v-flex sm6 mr-4>
          <div class="stream-info">
            <div class="loading" v-if="!isRunning"><i class="fa fa-spinner fa-pulse fa-3x"></i></div>
            <p class="mb-3">Add the URL and Stream Key to your Video Broadcast Software’s “Stream Settings”</p>
            <p class="ma-0">URL: {{ isRunning ? streamUrl :  'xxxxxxx' }}</p>
            <p class="ma-0">Stream Key: {{ isRunning ? streamKey :  'xxxxxxx' }}</p>
          </div>
        </v-flex>
        <v-flex sm6>
          <div class="time-info">
            <label>Remaining time to broadcast</label>
            <p>{{ remainingSeconds | timeInHours }}</p>
          </div>
        </v-flex>
      </v-layout>

      <!-- <div class="divider mt-5 mb-5"></div>

      <div class="share-view">
        <h3 class="mt-0 mb-4">Options</h3>
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

      <div class="share-view">
        <h3 class="mt-0 mb-4">Guest List</h3>
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

      <div class="divider mt-5 mb-5"></div>

      <div class="share-view">
        <h3 class="mt-0 mb-4">Share</h3>
        <v-flex x12>
          <div class="share-social-section d-inline-block">
            <v-btn class ="social-share-btn"><v-icon>fa-envelope</v-icon></v-btn>
            <social-sharing v-bind:url="profileUrl" inline-template>
              <div class="social-section">
                <network network="facebook">
                  <!-- <i class="fa fa-fw fa-facebook"></i> Facebook -->
                  <v-btn class ="social-share-btn"><v-icon>fa-facebook</v-icon></v-btn>
                </network>
                <network network="twitter">
                  <!-- <i class="fa fa-fw fa-twitter"></i> Twitter -->
                  <v-btn class ="social-share-btn"><v-icon>fa-twitter</v-icon></v-btn>
                </network>
              </div>
            </social-sharing>
          </div>
          <div class="input-section d-inline-block">
            <input type="text" class="form-control" v-model="profileUrl" readonly />
            <v-btn
              class="clipboard-btn"
              v-clipboard:copy="profileUrl">
              <v-icon>fa-clipboard</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </div>

      <div class="divider mt-5 mb-5"></div>

      <div class="share-view">
        <h3 class="mt-0 mb-4">Broadcast</h3>
        <v-btn
          :color="isRunning ? 'theme--dark red' : 'grey lighten-2'"
          class="px-4 cancel-btn"
          @click.native="isRunning && openStreamDeleteConfirmDialog()"
        >Cancel Stream</v-btn>
        <v-btn v-if="show_view_stream_button"
          dark
          color="green"
          class="px-4 view-btn"
          @click.native="viewStream()"
        >View Stream</v-btn>
        <v-btn v-else
          color="grey lighten-2"
          class="px-4 view-btn"
        >Waiting for Connection...</v-btn>
        <v-btn
          dark
          color="blue"
          class="px-4 view-btn"
          @click.native.stop="openAddMoreTimeDialog()"
        >Add more time</v-btn>
      </div>

      <v-dialog v-model="show_stream_delete_confirm_dialog">
        <v-card>
          <v-card-title class="headline">Delete a Stream</v-card-title>
          <v-card-text>If you click OK, the stream will no longer be available. Click OK to delete, or click Cancel.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="red--text darken-1" flat @click.native="deleteStream()">Ok</v-btn>
            <v-btn class="green--text darken-1" flat @click.native="closeStreamDeleteConfirmDialog()">Cancel</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="show_create_failed_dialog">
        <v-card>
          <v-card-title class="headline">Failed in Creating a Stream</v-card-title>
          <v-card-text>Channel failed to start, you have not been charged. Please try again.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="red--text darken-1" flat @click.native="closeCreateFailedDialog()">Ok</v-btn>
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
          <v-card-title class="headline">Add more time to your broadcast</v-card-title>
          <v-card-text>
            <v-select
              :items="periods"
              v-model="period"
              item-text="name"
              item-value="id"
              class="pt-0"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark round color="blue" @click.native="openPaymentDialog()">Add More Time</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <payment-modal
        v-if="show_payment_dialog"
        :type="'deposit'"
        :amount="streamCost"
        :dismiss="closePaymentDialog"
        :finish="deposit"
      />
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
