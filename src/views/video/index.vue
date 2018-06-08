<template>
  <div class="page video-page index-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <h2 class="page-title">Live Video</h2>
      <p class="page-subtitle mt-5 mb-4">You will get stream info as soon as stream has started</p>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 v-if="isPageReady">
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
        <v-btn dark color="red" class="px-4 cancel-btn" @click.native="openStreamDeleteConfirmDialog()">Cancel Stream</v-btn>
        <v-btn dark color="green" class="px-4 view-btn" @click.native="viewStream()" v-if="show_view_stream_button">View Stream</v-btn>
        <v-btn color="grey lighten-2" class="px-4 view-btn" v-else>Waiting for Connection...</v-btn>
      </div>
    </v-flex>
  <!--
    <v-flex xs12 sm10 offset-sm1>
      <h3>Live Video Settings</h3>

      <payment-modal v-if="show_payment_dialog"
        :type="'deposit'"
        :amount="StreamHourlyPrice"
        :dismiss="closePaymentDialog"
        :finish="deposit"></payment-modal>

      <v-dialog v-model="show_deposit_dialog">
        <v-card>
          <v-card-title class="headline">Deposite for Streaming</v-card-title>
          <v-card-text>You have not enough balance. Please deposit the money into your balance.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green" dark @click.native="openPaymentDialog()">Ok</v-btn>
            <v-btn class="grey" dark @click.native="closeDepositDialog()">Cancel</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container fluid grid-list-md v-if="!currentUser.stream || currentUser.stream.status == 'deleted'">
        <v-layout row justify-space-between wrap>
          <v-flex xs12>
            <v-btn color="blue" dark @click.native="openDepositDialog()">Create Stream</v-btn>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid grid-list-md v-else>
        <v-layout row justify-space-between wrap>
          <v-flex xs12>
            <label>Title:</label>
            <span>{{ currentUser.stream.name }}</span>
          </v-flex>
          <v-flex xs12>
            <label>Description:</label>
            <span>{{ currentUser.stream.description }}</span>
          </v-flex>
          <v-flex xs12>
            <label>Input Stream Url:</label>
            <span>{{ streamUrl }}</span>
          </v-flex>
          <v-flex xs12>
            <label>Input Stream Key:</label>
            <span>{{ streamKey }}</span>
          </v-flex>
          <v-flex xs12>
            <label>Started Time:</label>
            <span>{{ currentUser.stream.started_at || '' }}</span>
          </v-flex>
          <v-flex xs12>
            <label>Stopped Time:</label>
            <span>{{ currentUser.stream.stopped_at || '' }}</span>
          </v-flex>
          <v-flex xs12>
            <label>Total Cost:</label>
            <span>$0.00</span>
          </v-flex>
          <v-flex xs12>
            <v-btn color="yellow darken-3" dark @click="openStreamDeleteConfirmDialog()">Stop Stream</v-btn>
            <v-btn color="green" dark @click.native="viewStream()">View Stream</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  -->
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
