<template>
  <div class="page upload-page mx-5">
    <topbarNotification :content="topBarContent" ctaTitle="Connect" :cta="{ name: 'ManageIndex', params: { tab: 'payment'}}" />
    <h1 class="px-3 __title">Upload Music, Videos, Products & Broadcast Live!</h1>

    <v-container fluid grid-list-lg>
      <v-layout row wrap justify-start>
        <v-flex xs12 sm6 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadMusic"></div>

            <div class="text-left">
              <h3>Music</h3>
              <div class="upload-tab-description">
                Upload your albums, connnect products, add album credits & assign collaborators
              </div>
              <v-btn depressed class="upload-tab-btn" :to="'/upload/album'">Upload Music</v-btn>
            </div>
          </div>
        </v-flex>

        <v-flex xs12 sm6 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadProduct"></div>
            <div class="text-left">
              <h3>Product</h3>
              <div class="upload-tab-description">
                Upload products, set splits & recoup costs with collaborators
              </div>
              <v-btn depressed class="upload-tab-btn" :to="{name: 'AddProduct'}">Upload Product</v-btn>
            </div>
            </div>
        </v-flex>

        <v-flex xs12 sm6 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadVideo"></div>

            <div class="text-left">
              <h3>Video</h3>
              <div class="upload-tab-description">
                Upload videos, connect products, albums & collaborators
              </div>
              <v-btn depressed class="upload-tab-btn" :to="{name: 'VideoUpload'}">Upload Video</v-btn>
            </div>
          </div>
        </v-flex>

        <v-flex xs12 sm6 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadLive"></div>

            <div class="text-left">
              <h3>Live Video</h3>
              <div class="upload-tab-description">
                Broadcast live video, connect products, albums, collaborators & run pay-per-view
              </div>
              <!-- <v-btn v-if="isOnLive" depressed class="upload-tab-btn" :to="{name: 'VideoManage'}">Broadcast Live2</v-btn> -->
              <v-btn depressed class="upload-tab-btn" :to="{name: 'VideoCreate'}">Broadcast Live1</v-btn>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <!-- <hr class="mt-5 divider" /> -->
    </v-container>


    <v-container grid-list-lg px-0>
      <v-layout row>
        <v-flex xs6 class="meta-tab-container pl-0">
          <h1>Share to the world</h1>

          <div class="meta-tab-wrapper pl-0">
            <div class="meta-tab-img partnerImg"></div>
            <div class="meta-tab-description">
              <div class="app-bold">Become YouSound Partner</div>
               <div class="mb-3">Earn revenue from audio & video streams & user subscriptions.</div>

               <router-link to="/partners">
                 <b>Learn More</b>
               </router-link>
            </div>
          </div>
        </v-flex>

        <v-flex xs6 class="meta-tab-container px-0">
          <h1>Maximize your content</h1>

          <div class="meta-tab-wrapper pr-0">
            <div class="meta-tab-img growthImg"></div>
            <div class="meta-tab-description">
              <div class="app-bold">Measure your growth</div>
               <div class="mb-3">Visit your dashboard to keep track of all your analytics.</div>

               <router-link to="/dashboard">
                 <b>Goto Dashboard</b>
               </router-link>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/upload.scss" lang="scss" scoped>
