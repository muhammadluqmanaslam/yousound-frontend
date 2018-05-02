<template>
  <div class="page video-page">
    <v-flex xs12 sm10 offset-sm1>
      <h3>Live Video Settings</h3>
      <v-container fluid grid-list-md>
        <v-layout row justify-space-between wrap>
          <v-flex xs12>
            <v-btn primary :to="`/user/${$store.state.auth.user.slug}/video/create`">Create an Event</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
