<template>
  <div class="upload-page mx-5" :class="{page: !onMobile}">
    <div v-if="onMobile" class="allChildrenCenter flex-column text-center" style="height: 70vh">
      <div class="mb-3">
        To upload, manage or view sales & order history use the desktop version
        on
      </div>

      <div class="app-bold">
        <router-link to="/" class="black--text">yousound.com</router-link>
      </div>
      <img :src="require('@/assets/desktop.svg')" class="mb-3" alt="desktop icon" />
    </div>

    <div v-else>
      <topbarNotification
        :content="topBarContent"
        ctaTitle="Connect"
        :cta="{ name: 'UserSettings', params: { tab: 'bank-details' } }"
      />
      <h1 class="px-3 __title">Upload your content & share to the world!</h1>

      <v-container fluid grid-list-lg>
        <v-layout row wrap justify-start>
          <v-flex xs12 sm6 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadMusic"></div>

              <div class="text-left">
                <h3>Music</h3>
                <div class="upload-tab-description">
                  Upload your albums, connect products, assign collaborators
                </div>
                <v-btn depressed class="upload-tab-btn" :to="'/upload/album'"
                  >Upload</v-btn
                >
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
                <v-btn
                  depressed
                  class="upload-tab-btn"
                  :to="{ name: 'AddProduct' }"
                  >Upload</v-btn
                >
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
                <v-btn
                  depressed
                  class="upload-tab-btn"
                  :to="{ name: 'VideoUpload' }"
                  >Upload</v-btn
                >
              </div>
            </div>
          </v-flex>

          <v-flex xs12 sm6 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadLive"></div>

              <div class="text-left">
                <h3>Live Video</h3>
                <div class="upload-tab-description">
                  Broadcast live RMTP, connect products, & run pay-per-view
                </div>
                <!-- <v-btn v-if="isOnLive" depressed class="upload-tab-btn" :to="{name: 'VideoManage'}">Broadcast Live2</v-btn> -->
                <v-btn
                  depressed
                  class="upload-tab-btn"
                  :to="{ name: broadcastLink }"
                  >Broadcast</v-btn
                >
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/upload.scss" lang="scss" scoped>
