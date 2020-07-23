<template>
  <v-card flat>
    <v-layout row wrap class="setting-row pt-5 pb-4"></v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text">Disable Sign Ups</label></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          :input-value="settings.disable_sign_up"
          @change="updateSetting('disable_sign_up')"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text">Disable Login</label></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          label=""
          v-model="settings.login"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text">Disable Verification</label></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          label=""
          :input-value="settings.disable_verification"
          @change="updateSetting('disable_verification')"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text">Disable Live Video</label></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          label=""
          :input-value="settings.disable_live_video"
          @change="updateSetting('disable_live_video')"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text">Disable Uploads</label></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          label=""
          v-model="settings.uploads"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text"
          >Disable Product Uploads</label
        ></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          label=""
          v-model="settings.merch_uploads"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text"
          >Disable Site For Maintenance</label
        ></v-flex
      >
      <v-flex xs12 sm6 class="text-xs-right">
        <v-switch
          hide-details
          class="setting-cell-switch"
          label=""
          v-model="settings.maintenance"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12 sm6
        ><label class="setting-cell-text"
          >Send All Users Direct Message</label
        ></v-flex
      >
    </v-layout>
    <v-layout row wrap class="setting-row">
      <v-flex xs12>
        <v-text-field
          name="input-7-1"
          multi-line
          v-model="message"
          class="normal-input"
          full-width
          style="max-width: 100%;"
        />
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-btn color="primary" @click.native="sendGlobalMessage()"
        >SEND MESSAGE TO USERS</v-btn
      >
    </v-layout>
  </v-card>
</template>

<script type="text/javascript" src="./settings.ctrl.js"></script>
