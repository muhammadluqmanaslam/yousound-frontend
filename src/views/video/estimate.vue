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
                  <input type="number" min="0" max="12" />
                  <span>:</span>
                  <input type="number" min="0" max="59" />
                  <span>:</span>
                  <input type="number" min="0" max="59" />
                </div>
                <div class="duration-helper">
                  <span>hours</span>
                  <span>mintues</span>
                  <span>seconds</span>
                </div>
              </v-flex>
              <v-flex xs7 slider-container>
                <v-slider hide-details />
              </v-flex>
            </v-layout>

            <div><label>live stream view count</label></div>
            <v-layout>
              <v-flex xs5>
                <input type="number" max="10000000" />
              </v-flex>
              <v-flex xs7 slider-container>
                <v-slider hide-details />
              </v-flex>
            </v-layout>

            <div><label>How long does the average viewer watch?</label></div>
            <div>
              <div class="radio">
                <input id="average-100" type="radio" value="100" />
                <label for="average-100"> 100% of the live stream</label>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script src="./estimate.ctrl.js"></script>
