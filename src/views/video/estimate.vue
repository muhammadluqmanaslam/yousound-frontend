<template>
  <div class="page video-page info-page">
    <div class="d-flex">
      <div class="page-content" v-if="isPageReady">
        <v-layout row wrap>
          <v-flex xs6 class="description-container">
            <h4>How it works</h4>
            <p>
              Create one of a kind live video experiences designed to maximize
              sales with exclusive products & downloads for your most engaging
              customers. Pay as you go. Unused credit rolls over to your next
              broadcast. All broadcasts include delivery of all resolutions up
              to HD 1080p.
            </p>
            <p>
              To learn more visit the
              <a
                href="//support.yousound.com/en/articles/4490519-live-video-cost"
                target="_blank"
                >Frequently Asked Questions</a
              >
            </p>
            <v-btn
              v-if="!isStreamRunning"
              round
              dark
              color="blue"
              class="mt-4"
              @click="gotoNextView"
              >Setup Live Stream</v-btn
            >
          </v-flex>
          <v-flex xs6 class="estimate-container">
            <h4>Estimate your cost</h4>

            <div class="label">Duration of an average live stream</div>
            <v-layout class="input">
              <v-flex xs5>
                <div class="duration">
                  <input
                    type="number"
                    v-model="durationDetail.hour"
                    min="0"
                    max="12"
                    size="3"
                    @change="handleDurationDetailChange"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    v-model="durationDetail.min"
                    min="0"
                    max="59"
                    size="3"
                    @change="handleDurationDetailChange"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    v-model="durationDetail.sec"
                    min="0"
                    max="59"
                    size="3"
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

            <div class="label">Live stream view count</div>
            <v-layout class="input">
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

            <div class="label">How long does the average viewer watch?</div>
            <div class="radio-container">
              <div class="radio">
                <input
                  v-model="percentage"
                  id="average-30"
                  type="radio"
                  name="percentage"
                  value="30"
                />
                <label for="average-30">30% of<br />the live stream</label>
              </div>
              <div class="radio">
                <input
                  v-model="percentage"
                  id="average-50"
                  type="radio"
                  name="percentage"
                  value="50"
                />
                <label for="average-50">50% of<br />the live stream</label>
              </div>
              <div class="radio">
                <input
                  v-model="percentage"
                  id="average-90"
                  type="radio"
                  name="percentage"
                  value="90"
                />
                <label for="average-90">90% of<br />the live stream</label>
              </div>
              <div class="radio">
                <input
                  v-model="percentage"
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

            <div class="total">
              <label>Estimated Total</label>
              <span>${{ totalPrice | formatNumber }}</span>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script src="./estimate.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped>
