<template>
  <div class="page video-page delete-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1>
      <h2 class="page-title">Live Video</h2>
      <div class="divider mt-3"></div>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 text-xs-center>
      <h4>Your channel is being deleted...</h4>
      <p class="mt-2">
        This process can take up to 5 minutes. When this process is completed,
        you can create a new channel<br />
        This page should automatically refresh.
      </p>
      <v-btn
        round
        dark
        color="blue"
        class="px-3 mt-3"
        @click.native="getStream()"
        >Refresh</v-btn
      >
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./delete.ctrl.js"></script>
