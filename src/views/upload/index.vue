<template>
  <div class="upload-page mx-5" :class="{ page: !onMobile }" v-if="currentUser.creator_verified">
    <content-top-header class="black-theme">
      <template slot="topHeader">
        <ul class="pr-3">
          <li class="active">
            Upload
          </li>
        </ul>
      </template>
    </content-top-header>

    <div
      v-if="onMobile"
      class="allChildrenCenter flex-column text-center"
      style="height: 70vh"
    >
      <div class="mb-3">
        To upload, manage or view sales & order history use the desktop version
        on
      </div>

      <div class="app-bold">
        <router-link to="/" class="black--text">yousound.com</router-link>
      </div>
      <img
        :src="require('@/assets/desktop.svg')"
        class="mb-3"
        alt="desktop icon"
      />
    </div>

    <div v-else>
      <!-- <topbarNotification
        :content="topBarContent"
        ctaTitle="Connect"
        :cta="{ name: 'UserSettings', params: { tab: 'bank-details' } }"
      /> -->
      <!-- <h1 class="px-3 __title mb-0">Share to the world</h1> -->

      <v-container fluid grid-list-lg px-0 mb-4 class="margin-top-header">
        <v-layout upload-flex>
          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadMusic"></div>

              <div class="text-left my-4">
                <h3>Music</h3>
                <div class="upload-tab-description">
                  Connect products & assign collaborators to your albums
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn depressed class="upload-tab-btn" :to="'/upload/album'">
                Upload album
              </v-btn>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadVideo"></div>

              <div class="text-left my-4">
                <h3>Video</h3>
                <div class="upload-tab-description">
                  Connect your products & albums 
to your videos
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn
                depressed
                class="upload-tab-btn"
                :to="{ name: 'VideoUpload' }"
              >
                upload video
              </v-btn>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadProduct"></div>
              <div class=" text-left my-4">
                <h3>Product</h3>
                <div class="upload-tab-description">
                  Set splits & recoup costs with collaborators on your products
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn
                depressed
                class="upload-tab-btn"
                :to="{ name: 'AddProduct' }"
              >
                Add product
              </v-btn>
            </div>
          </v-flex>

         

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadLive"></div>

              <div class="text-left my-4">
                <h3>Live</h3>
                <div class="upload-tab-description">
                  Stream live directly from your browser & run pay-per-view
                </div>
                <!-- <v-btn v-if="isOnLive" depressed class="upload-tab-btn" :to="{name: 'VideoManage'}">Broadcast Live2</v-btn> -->
              </div>

              <v-spacer></v-spacer>

              <v-btn
                depressed
                class="upload-tab-btn"
                :to="{ name: broadcastLink }"
                >Go Live</v-btn
              >
            </div>
          </v-flex>
        </v-layout>
      </v-container>


      <h1 class="__title mt-5">Complete your setup</h1>

      <v-container fluid grid-list-lg px-0 mb-4>
        <v-layout upload-flex>

          <v-flex v-if="onMobile" xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">

              <div class="text-left">
                <div class="dflex align-center">
                  <img src="../../assets/flashlight 1.svg" width="32">
                  <h3 class="secondary-heading">Spotlight video</h3>
                </div>
                <div class="upload-tab-description light">
                  Add video clip to attract new followers when
                    people view your previews
                </div> 
              </div>


              <div class="toggle-container">
                <v-btn depressed class="upload-tab-btn width-auto" to="/spotlight">
                  Upload spotlight video
                </v-btn>
                <div v-if="isSpotlightVideoAvailable" class="dflex align-center">
                  <div class="dflex align-center">
                    <img src="../../assets/c-check.svg" width="25">
                    <p class="bold-text">Video uploaded</p>

                  </div>
                  <router-link :to="'/spotlight'">
                    <div class="anchor-text">Edit</div>
                  </router-link>

                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">

              <div class="text-left">
                <div class="dflex align-center">
                  <img src="../../assets/cup.svg" width="32">
                  <h3 class="secondary-heading">Upgrade account</h3>
                </div>
                <div class="upload-tab-description light">
                  Unlock features like sales collaboration &
                  get paid to share
                </div> 
              </div>


              <div class="toggle-container">
                <v-btn depressed class="upload-tab-btn width-auto" >
                  View plans
                </v-btn>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>

    <v-dialog v-model="initAppDownload" content-class="download-app-dialog">
      <download-app v-if="initAppDownload" type="type2" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/upload.scss" lang="scss" scoped>
