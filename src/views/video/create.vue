<template>
  <div class="page video-page">
    <v-flex xs12 sm10 offset-sm1>
      <h3>Live Video Settings</h3>
      <form v-on:submit.prevent="submit()" class="container grid-list-md">
        <v-layout row justify-space-between wrap>
          <v-flex xs12 sm6 form-group>
            <label class="control-label">Title</label>
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
            <v-btn round primary type="submit">Create stream</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./create.ctrl.js"></script>
