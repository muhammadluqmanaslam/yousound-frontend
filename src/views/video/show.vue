<template>
  <div class="page video-page show-page mx-5">
    <v-layout row>
      <v-flex sm9>
        {{ stream }}
      </v-flex>
      <v-flex sm3>
        {{ comments }}
      </v-flex>
    </v-layout>
  </div>
</template>

<script type="text/javascript" src="./show.ctrl.js"></script>
