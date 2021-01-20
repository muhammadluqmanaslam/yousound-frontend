<template>
  <div class="page video-page create-page mx-5">
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
              <label @click="onTab(tab)">{{ tab.title }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="isPageReady">
        <form v-on:submit.prevent="submit()">
          <h3 class="mt-3 mb-4">Broadcast Details</h3>

          <v-divider></v-divider>

          <v-layout row class="mt-5">
            <v-flex sm5>
              <div class="form-group">
                <label class="control-label">Title of Event</label>
                <input
                  type="text"
                  class="form-control"
                  name="title"
                  v-model="stream.name"
                  v-validate="'required'"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Pay Per View?</label>
                <v-select
                  :items="view_prices"
                  v-model="stream.view_price"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Event Capacity</label>
                <v-select
                  :items="viewers_limits"
                  v-model="stream.viewers_limit"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                />
              </div>

              <div class="form-group">
                <label class="control-label">Genre</label>
                <label>{{ stream.genre.name }}</label>
              </div>

              <div class="text-center mt-5">
                <v-btn round dark color="blue" class="px-5" type="submit"
                  >Update Channel</v-btn
                >
              </div>
            </v-flex>

            <v-flex sm7 pl-5>
              <div>
                <label class="control-label">Thumbnail</label>

                <div class="video-thumbnail-wrapper">
                  <div
                    v-if="stream_cover_url"
                    :style="{
                      'background-image': 'url(' + stream_cover_url + ')',
                    }"
                    class="video-thumbnail"
                  ></div>
                </div>

                <!-- <div class="cover-wrapper">
                  <input
                    type="file"
                    name="stream_cover_file"
                    id="stream_cover_file"
                    accept=".png, .jpg, .jpeg"
                    v-validate="'required'"
                    @change="imageChanged($event)"
                  />
                  <label for="stream_cover_file">Upload</label>
                  <span>*PNG, JPG, GIF</span>
                </div> -->
              </div>
            </v-flex>
          </v-layout>
        </form>
      </div>
    </div>
  </div>
</template>

<script src="./edit.ctrl.js"></script>
