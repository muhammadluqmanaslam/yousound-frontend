<template>
  <div class="page video-page create-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <h2 class="page-title">Live Video</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <payment-modal v-if="show_payment_dialog"
        :type="''"
        :amount="streamCost"
        :dismiss="closePaymentDialog"
        :finish="deposit"></payment-modal>

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
              <div class="my-card__text">Pay $5 per hour.  After payment, you will receive your stream key.</div>
            </div>
          </v-flex>
        </v-layout>

        <div class="divider mt-3 mb-5"></div>

        <v-layout row>
          <v-flex sm8 form-group mr-4>
            <label class="control-label">What is the name of your stream?</label>
            <input type="text" class="form-control" name="title" v-model="stream.name" v-validate="'required'">
          </v-flex>
          <v-flex sm4>
            <label class="control-label">How long do you want to stream?</label>
            <v-select
              v-bind:items="periods"
              v-model="period"
              item-text="name"
              item-value="id"
              class="pt-0"></v-select>
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

  <!--
    <v-flex xs12 sm10 offset-sm1>
      <h3>Live Video Settings</h3>
      <form v-on:submit.prevent="submit()" class="container grid-list-md">
        <v-layout row justify-space-between wrap>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Title<label class="required">*</label></label>
            <input type="text" class="form-control" name="title" v-model="stream.name" v-validate="'required'">
          </v-flex>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Description</label>
            <input type="text" class="form-control" v-model="stream.description">
          </v-flex>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Input Type</label>
            <v-select
              v-bind:items="MediaLiveInputTypes"
              v-model="stream.ml_input_type"
              single-line
              autocomplete></v-select>
          </v-flex>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Input Codec</label>
            <v-select
              v-bind:items="MediaLiveInputCodecs"
              v-model="stream.ml_input_codec"
              single-line
              autocomplete></v-select>
          </v-flex>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Input Resolution</label>
            <v-select
              v-bind:items="MediaLiveInputResolutions"
              v-model="stream.ml_input_resolution"
              single-line
              autocomplete></v-select>
          </v-flex>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Input Maximum Bitrate</label>
            <v-select
              v-bind:items="MediaLiveInputMaximumBitrates"
              v-model="stream.ml_input_maximum_bitrate"
              single-line
              autocomplete></v-select>
          </v-flex>
          <v-flex xs12 sm6 form-group>
            <v-btn round color="primary" dark type="submit">Create stream</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>
  -->
  </div>
</template>

<script type="text/javascript" src="./create.ctrl.js"></script>
