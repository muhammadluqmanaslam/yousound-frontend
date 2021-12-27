<template>
  <div row wrap class="page manage-video-page">
      <div class="page-content" v-if="currentUser && isPageReady">
        <v-container fluid grid-list-md px-0>
            <v-layout row wrap>
                <v-flex xs12 v-for="(video, i) in videos" :key="i" class="video-container top-3">
                    <list-video listType="list" :item="video" />
                </v-flex>
            </v-layout>
        </v-container>
      </div>
  </div>
</template>

<script type="text/javascript" src="./manageVideo.ctrl.js"></script>
