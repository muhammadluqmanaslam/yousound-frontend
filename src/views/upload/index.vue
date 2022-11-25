<template>
  <div class="upload-page mx-5" :class="{ page: !onMobile }" v-if="currentUser.creator_verified">
    <content-top-header>
      <template slot="topHeader">
        <ul class="pr-3">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            class="nav-li"
            :class="[ `nav-${tab.id}`, {isParent: tab.isParent}]"
          >
            <label class="nav-label" @click="onTab(tab)">
              {{ tab.title }}
              <v-icon v-if="tab.isParent">chevron_right</v-icon>
            </label>
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

              <div class="text-left">
                <h3>Music</h3>
                <div class="upload-tab-description">
                  Upload your albums, connect products, assign collaborators
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn depressed class="upload-tab-btn" :to="'/upload/album'">
                Upload
              </v-btn>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadProduct"></div>
              <div class="text-left">
                <h3>Product</h3>
                <div class="upload-tab-description">
                  Upload products, set splits & recoup costs with collaborators
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn
                depressed
                class="upload-tab-btn"
                :to="{ name: 'AddProduct' }"
              >
                Upload
              </v-btn>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadVideo"></div>

              <div class="text-left">
                <h3>Video</h3>
                <div class="upload-tab-description">
                  Upload videos, connect products, albums & collaborators
                </div>
              </div>

              <v-spacer></v-spacer>

              <v-btn
                depressed
                class="upload-tab-btn"
                :to="{ name: 'VideoUpload' }"
              >
                Upload
              </v-btn>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">
              <div class="upload-tab-img uploadLive"></div>

              <div class="text-left">
                <h3>Broadcast Live</h3>
                <div class="upload-tab-description">
                  Broadcast live RMTP, connect products, & run pay-per-view
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


      <h1 class="px-3 __title mt-3">Complete your setup</h1>

      <v-container fluid grid-list-lg px-0 mb-4>
        <v-layout upload-flex>
          <v-flex xs12 class="upload-tab-container">
            <div class="upload-tab-wrapper">

              <div class="text-left">
                <div class="dflex align-center">
                  <img src="../../assets/visa.svg" width="32">
                  <h3 class="secondary-heading">Accept Payments</h3>
                </div>
                <div class="upload-tab-description light">
                  Connect to <a href="https://stripe.com" target="_blank">Stripe.com</a> to get paid & manage your customers
                </div> 
              </div>


              <div class="toggle-container">
                <v-btn depressed class="upload-tab-btn width-auto" >
                  Connect to Stripe
                </v-btn>
                <div class="dflex align-center">
                  <div class="dflex align-center">
                    <img src="../../assets/c-check.svg" width="25">
                    <p class="bold-text">Connected</p>
                  
                  </div>

                  <a href="#" class="anchor-text">Edit</a>
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs12 class="upload-tab-container">
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
                <div class="dflex align-center">
                  <div class="dflex align-center">
                    <img src="../../assets/c-check.svg" width="25">
                    <p class="bold-text">Video uploaded</p>
                  
                  </div>

                  <a href="#" class="anchor-text">Edit</a>
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

      <h1 class="px-3 __title">Don’t forget to...</h1>

      <div class="check-settings">
        <div class="_checkbox">
          <v-checkbox
            v-model="isStripeConnected"
            hide-details
            :append-icon="
              isStripeConnected ? 'check_circle' : 'radio_button_unchecked'
            "
            disabled
            class="mr-2"
          ></v-checkbox>

          <div class="_label">
            <span
              >Connect your Stripe account to start accepting payments.</span
            >
            <span
              class="_cta ml-3"
              @click="
                $router.push({
                  name: 'UserSettings',
                  params: { tab: 'bank-details' },
                })
              "
              >Check Setting</span
            >
          </div>
        </div>
        <div class="_checkbox">
          <v-checkbox
            v-model="isAppDownloadClicked"
            hide-details
            :append-icon="
              isAppDownloadClicked ? 'check_circle' : 'radio_button_unchecked'
            "
            disabled
            class="mr-2"
          ></v-checkbox>

          <div class="_label">
            <span
              >Download the app & upload your spotlight video to promote your
              profile</span
            >
            <span class="_cta ml-3" @click="initAppDownload = true">
              Learn More
            </span>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="initAppDownload" content-class="download-app-dialog">
      <download-app v-if="initAppDownload" type="type2" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/upload.scss" lang="scss" scoped>
