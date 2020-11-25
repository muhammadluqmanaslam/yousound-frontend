<template>
  <div class="page video-page info-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Broadcast</h2>
          <ul class="pr-3">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :class="{ active: tab.id === active_tab }"
            >
              <label @click="!tab.disabled && onTab(tab)">{{
                tab.title
              }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="isPageReady">
        <h3 class="mt-3 mb-4">Introduction to YouSound Live</h3>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs5>
            <h4>How it works</h4>
            <p>
              YouSound allows verified users to create one of a kind of real
              time experiences with live video. YouSound is designed to maximize
              sale conversations to a limited audience by offering exclusive
              products and prioritizing your most engaging customers. Verified
              users can leverage multiple revenue streams including:
            </p>
            <ul>
              <li>Pay Per View</li>
              <li>Selling products on your live stream</li>
            </ul>
            <p>
              All broadcasts include delivery of all resolutions up to HD
              1080p.<br />
              To learn more visit the
              <router-link to="/">Frequently Asked Questions</router-link>
            </p>
            <v-btn
              v-if="!isStreamRunning"
              round
              dark
              color="blue"
              class="mt-4"
              :to="`/user/${currentUser.slug}/video/create`"
              >Setup Broadcast</v-btn
            >
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs5>
            <h4>Estimate your cost</h4>
            <h5>Add details about your content and audience</h5>

            <div><label>Duration of an average live stream</label></div>
            <v-layout>
              <v-flex xs5>
                <div class="duration">
                  <input
                    type="number"
                    v-model="durationDetail.hour"
                    min="0"
                    max="12"
                    @change="handleDurationDetailChange"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    v-model="durationDetail.min"
                    min="0"
                    max="59"
                    @change="handleDurationDetailChange"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    v-model="durationDetail.sec"
                    min="0"
                    max="59"
                    @change="handleDurationDetailChange"
                  />
                </div>
                <div class="duration-helper">
                  <span>hours</span>
                  <span>mintues</span>
                  <span>seconds</span>
                </div>
              </v-flex>
              <v-flex xs7 slider-container>
                <v-slider
                  v-model="durationMirror"
                  min="0"
                  max="186"
                  step="1"
                  @input="handleDurationMirrorChange"
                  hide-details
                />
              </v-flex>
            </v-layout>

            <div><label>live stream view count</label></div>
            <v-layout>
              <v-flex xs5>
                <input
                  v-model="viewers"
                  type="number"
                  min="0"
                  max="10000000"
                  @change="handleViewersChange"
                />
              </v-flex>
              <v-flex xs7 slider-container>
                <v-slider
                  v-model="viewersMirror"
                  min="0"
                  max="290"
                  step="1"
                  @input="handleViewersMirrorChange"
                  hide-details
                />
              </v-flex>
            </v-layout>

            <div><label>How long does the average viewer watch?</label></div>
            <div class="radio-container">
              <div class="radio">
                <input
                  id="average-30"
                  type="radio"
                  name="percentage"
                  value="30"
                />
                <label for="average-30">30% of<br />the live stream</label>
              </div>
              <div class="radio">
                <input
                  id="average-50"
                  type="radio"
                  name="percentage"
                  value="50"
                />
                <label for="average-50">50% of<br />the live stream</label>
              </div>
              <div class="radio">
                <input
                  id="average-90"
                  type="radio"
                  name="percentage"
                  value="90"
                />
                <label for="average-90">90% of<br />the live stream</label>
              </div>
              <div class="radio">
                <input
                  id="average-100"
                  type="radio"
                  name="percentage"
                  value="100"
                />
                <label for="average-100"
                  >100% of<br />
                  the live stream</label
                >
              </div>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script src="./estimate.ctrl.js"></script>
