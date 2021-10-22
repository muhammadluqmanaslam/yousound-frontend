<template>
  <div class="page upload-page mx-5">
    <h1 class="px-3 __title">Upload Music, Videos, Products & Broadcast Live!</h1>

    <v-container fluid grid-list-lg>
      <v-layout row justify-start>
        <v-flex xs6 sm6 md3 lg3 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadMusic"></div>
            <div class="upload-tab-description">
              Upload your albums, connnect products, add album credits & assign collaborators
            </div>
            <v-btn depressed class="upload-tab-btn" :to="'/upload/album'">Upload Music</v-btn>
          </div>
        </v-flex>

        <v-flex xs6 sm6 md3 lg3 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadVideo"></div>
            <div class="upload-tab-description">
              Upload videos, connect products, albums & collaborators
            </div>
            <v-btn depressed class="upload-tab-btn" :to="{name: 'VideoUpload'}">Upload Video</v-btn>
          </div>
        </v-flex>

        <v-flex xs6 sm6 md3 lg3 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadLive"></div>
            <div class="upload-tab-description">
              Broadcast live video, connect products, albums, collaborators & run pay-per-view
            </div>
            <v-btn depressed class="upload-tab-btn" :to="{name: 'VideoCreate'}">Broadcast Live</v-btn>
          </div>
        </v-flex>

        <v-flex xs6 sm6 md3 lg3 class="upload-tab-container">
          <div class="upload-tab-wrapper">
            <div class="upload-tab-img uploadProduct"></div>
            <div class="upload-tab-description">
              upload products, set splits & recoup costs with collaborators
            </div>
            <v-btn depressed class="upload-tab-btn" :to="{name: 'AddProduct'}">Upload Product</v-btn>
            </div>
        </v-flex>
      </v-layout>
    </v-container>


    <v-container grid-list-lg>
      <v-layout row>
        <v-flex xs6 class="meta-tab-container">
          <div class="meta-tab-wrapper">
            <div class="meta-tab-img handImg"></div>
            <div class="meta-tab-description">
              <div class="app-bold">Best practices for successful releases</div>
               <div>Learn how to lauch a product, album, or video on YouSound effectively to build an audience & generate revenue</div>
            </div>
          </div>
        </v-flex>

        <v-flex xs6 class="meta-tab-container">
          <div class="meta-tab-wrapper">
            <div class="meta-tab-img boardImg"></div>
            <div class="meta-tab-description">
              <div class="app-bold">Earn revenue as a YouSound Partner</div>
               <div>Learn how to become a YouSound partner to start earning money from your album & video streams.</div>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/upload.scss" lang="scss" scoped>
