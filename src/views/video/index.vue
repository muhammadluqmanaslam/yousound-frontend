<template>
  <div class="page video-page">
    <v-flex xs12 sm10 offset-sm1>
      <h3>Live Video Settings</h3>

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

      <v-container fluid grid-list-md v-if="!currentUser.stream || currentUser.stream.status == 'deleted'">
        <v-layout row justify-space-between wrap>
          <v-flex xs12>
            <v-btn color="blue" dark :to="`/user/${currentUser.slug}/video/create`">Create Stream</v-btn>
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
            <label>Input Url:</label>
            <span>{{ currentUser.stream.ml_input_dest_1_url }}</span>
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
            <!-- <v-btn color="yellow darken-3" dark @click="stopStream()" v-if="currentUser.stream.status == 'started'">Stop Stream</v-btn>
            <v-btn color="green" dark @click="startStream()" v-else>Start Stream</v-btn>
            <v-btn color="red" dark @click="openStreamDeleteConfirmDialog()">Delete Stream</v-btn> -->
          </v-flex>
        </v-layout>
      </v-container>

    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
