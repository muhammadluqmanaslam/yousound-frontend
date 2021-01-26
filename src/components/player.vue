<template>
  <v-layout
    row
    wrap
    class="bottom-player"
    v-if="$store.getters['player/isPlaying']"
  >
    <v-flex xs12 sm4 md4 class="track-detail-section">
      <router-link :to="`/${item.album_type}/${item.slug}`">
        <template v-if="item.album_type == 'playlist'">
          <div
            class="track-cover-image"
            :class="item.album_type"
            :style="{
              'background-image': `url(${album1Cover}), url(${album2Cover}), url(${album3Cover}), url(${album4Cover})`,
            }"
          ></div>
        </template>
        <template v-else>
          <div
            class="track-cover-image"
            :style="{ 'background-image': 'url(' + item.cover.url + ')' }"
          ></div>
        </template>
      </router-link>
      <div class="track-info-section">
        <div class="track-info">
          <label class="track-index" id="trackIndex">{{ trackIndex }}</label>
          <label class="track-name" id="trackName">{{ track.name }}</label>
        </div>
        <div class="user-info">
          <template v-if="item.collaborators_count > 0">
            <router-link class="user-name" :to="'/' + item.user.slug">{{
              item.user.display_name
            }}</router-link>
            <template v-for="c in item.collaborators">
              <span :key="`span-${c.user.id}`">,&nbsp;</span>
              <router-link
                :key="`link-${c.user.id}`"
                class="user-name"
                :to="`/${c.user.slug}`"
                >{{ c.user.display_name }}</router-link
              >
            </template>
            <!-- <router-link class="user-name" :to="`/${item.album_type}/${item.slug}`">Multiple Collaborators</router-link> -->
          </template>
          <template v-else-if="item.album_type == 'album'">
            <router-link class="user-name" :to="'/' + item.user.slug">{{
              item.user.display_name
            }}</router-link>
            <v-btn
              v-if="
                $store.state.auth.user &&
                item.user.id != $store.state.auth.user.id
              "
              :class="{
                'follow-btn': true,
                follow: !item.user.is_following,
                following: item.user.is_following,
              }"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false"
              @click.native="followUser()"
              >{{ followButtonText }}</v-btn
            >
          </template>
          <template v-else>
            <router-link class="user-name" :to="'/' + track.user.slug">{{
              track.user.display_name
            }}</router-link>
            <v-btn
              v-if="
                $store.state.auth.user &&
                track.user.id != $store.state.auth.user.id
              "
              :class="{
                'follow-btn': true,
                follow: !track.user.is_following,
                following: track.user.is_following,
              }"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false"
              @click.native="followUser()"
              >{{ followButtonText }}</v-btn
            >
          </template>
        </div>
      </div>
    </v-flex>
    <v-flex xs12 sm4 md4 style="position: relative">
      <div class="loading" id="loading" v-if="!isLoaded"></div>
      <div class="player-section" v-if="isLoaded">
        <div class="controls-section">
          <!-- <v-tooltip top>
            <v-btn
              slot="activator"
              @click.native="randomPlay()"
              class="player-control-btn"
              :class="{ selected: $store.state.player.isShuffle }"
            >
              <svg
                width="25px"
                height="20px"
                viewBox="0 0 25 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g
                  id="Design"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="Music-Players-––-Preference-Order"
                    transform="translate(-806.000000, -31.000000)"
                    fill="#999"
                  >
                    <g id="Group-29" transform="translate(0.000000, 1.000000)">
                      <g
                        id="Group-20"
                        transform="translate(612.000000, 22.000000)"
                      >
                        <g
                          id="Group-17"
                          transform="translate(194.000000, 0.000000)"
                        >
                          <path
                            d="M21.3382513,21.5824203 L24.8187075,24.3638853 C24.932736,24.4543538 24.9999931,24.5919838 24.9999931,24.7373137 C24.9999931,24.8836051 24.932736,25.0202722 24.8187075,25.1117036 L21.3382513,27.8931686 C21.250537,27.9634272 21.1413799,28 21.0322085,28 C20.9610656,28 20.8889371,27.9846014 20.8226657,27.95284 C20.65308,27.8729572 20.5448943,27.7035672 20.5448943,27.5187773 L20.5448943,25.6910949 C20.3002515,25.7190063 19.9990945,25.7430677 19.6248231,25.7430677 C17.7398665,25.7430677 14.4192531,25.1511636 11.8266967,21.5189017 C12.2087537,20.9414305 12.571325,20.3023735 12.9104964,19.6017022 C15.7749813,24.4014195 19.8558231,23.8836254 20.5448943,23.7565826 L20.5448943,21.9558488 C20.5448943,21.7710588 20.65308,21.6016689 20.8226657,21.5217874 C20.9912799,21.4409446 21.1920513,21.4650017 21.3382513,21.5824203 Z M20.5448943,12.1591328 C19.8148802,12.0205328 14.830553,11.3381616 12.0011537,18.1031884 C9.09865452,25.0404836 3.73128881,25.748842 1.66406651,25.748842 C1.14750522,25.748842 0.837568156,25.7045692 0.82294816,25.701682 C0.290792588,25.6189121 -0.0717758871,25.1261408 0.0120440905,24.6016081 C0.0948883541,24.0780382 0.589033936,23.7190469 1.12216379,23.800854 C1.36485087,23.8355025 7.17568504,24.5958338 10.1990399,17.3678743 C13.2555248,10.0590762 18.7778662,10.0263477 20.5448943,10.2226905 L20.5448943,8.4816195 C20.5448943,8.29683383 20.65308,8.12744816 20.8226657,8.04756247 C20.9912799,7.96574821 21.1920513,7.99173391 21.3382513,8.10819102 L24.8187075,10.8887046 C24.932736,10.9801331 24.9999931,11.1177616 24.9999931,11.2630902 C24.9999931,11.4084187 24.932736,11.5460472 24.8187075,11.6374758 L21.3382513,14.4189465 C21.250537,14.4892036 21.1413799,14.525775 21.0322085,14.525775 C20.9610656,14.525775 20.8889371,14.510375 20.8226657,14.4786179 C20.65308,14.3987322 20.5448943,14.2293465 20.5448943,14.0445609 L20.5448943,12.1591328 Z M1.12606236,12.1148471 C0.601703933,12.2034042 0.0958626395,11.83959 0.0120440905,11.3150616 C-0.0717758871,10.7895617 0.290792588,10.2967904 0.82294816,10.214019 C0.886301,10.2024762 6.22248243,9.44791924 10.0664828,14.4266465 C9.70684007,15.0108463 9.37058302,15.6672319 9.05285453,16.3746317 C5.86576253,11.4584616 1.17966806,12.1100471 1.12606236,12.1148471 Z"
                            id="Clip-2"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </v-btn>
            <span>Play random albums</span>
          </v-tooltip> -->

          <div class="volume-container">
            <div class="volume">
              <v-slider
                v-model="volume"
                @input="updateVolume"
                thumb-label
                class="volume-ranger"
                hide-details
              ></v-slider>
              <v-icon>volume_up</v-icon>
            </div>
          </div>

          <v-btn class="player-control-btn" @click.native="skip('prev')">
            <svg
              width="17px"
              height="20px"
              viewBox="0 0 17 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Design"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Music-Players-––-Preference-Order"
                  transform="translate(-881.000000, -31.000000)"
                  fill="#999"
                >
                  <g id="Group-29" transform="translate(0.000000, 1.000000)">
                    <g
                      id="Group-20"
                      transform="translate(612.000000, 22.000000)"
                    >
                      <g
                        id="Group-17"
                        transform="translate(194.000000, 0.000000)"
                      >
                        <path
                          d="M88.3333333,18.7692308 L75,28 L75,8 L88.3333333,17.2307692 L88.3333333,10.2222222 L91.6666667,10.2222222 L91.6666667,26.8888889 L88.3333333,26.8888889 L88.3333333,18.7692308 Z"
                          id="Combined-Shape-Copy"
                          transform="translate(83.333333, 18.000000) rotate(-180.000000) translate(-83.333333, -18.000000) "
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </v-btn>
          <v-btn
            class="player-control-btn play"
            @click.native="$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)"
            id="play"
            v-if="!isPlaying"
          >
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn
            class="player-control-btn pause"
            id="pause"
            v-if="isPlaying"
            @click.native="pause()"
          >
            <v-icon>pause</v-icon>
          </v-btn>
          <v-btn class="player-control-btn" @click.native="skip('next')">
            <svg
              width="17px"
              height="20px"
              viewBox="0 0 17 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Design"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Music-Players-––-Preference-Order"
                  transform="translate(-1023.000000, -31.000000)"
                  fill="#999"
                >
                  <g id="Group-29" transform="translate(0.000000, 1.000000)">
                    <g
                      id="Group-20"
                      transform="translate(612.000000, 22.000000)"
                    >
                      <g
                        id="Group-17"
                        transform="translate(194.000000, 0.000000)"
                      >
                        <path
                          d="M230.333333,18.7692308 L217,28 L217,8 L230.333333,17.2307692 L230.333333,10.2222222 L233.666667,10.2222222 L233.666667,26.8888889 L230.333333,26.8888889 L230.333333,18.7692308 Z"
                          id="Combined-Shape"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </v-btn>
          <v-btn
            class="player-control-btn"
            :class="{ selected: isRepeated }"
            @click.native="setRepeated()"
          >
            <svg
              width="19px"
              height="22px"
              viewBox="0 0 19 22"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Design"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Music-Players-––-Preference-Order"
                  transform="translate(-1089.000000, -30.000000)"
                  fill-rule="nonzero"
                  fill="#999"
                >
                  <g id="Group-29" transform="translate(0.000000, 1.000000)">
                    <g
                      id="Group-20"
                      transform="translate(612.000000, 22.000000)"
                    >
                      <g
                        id="Group-17"
                        transform="translate(194.000000, 0.000000)"
                      >
                        <g
                          id="Group-24"
                          transform="translate(283.000000, 7.000000)"
                        >
                          <path
                            d="M10.6673959,5.092988 C12.3150242,5.35561496 13.8472319,6.16757868 15.0030722,7.45126942 C17.749136,10.5010822 17.4921392,15.211601 14.4260261,17.9723416 C11.359913,20.7330823 6.64833546,20.4962879 3.90227167,17.4464751 C1.15620788,14.3966623 1.41320466,9.68614356 4.47931778,6.9254029 C4.88974534,6.55585228 4.92288263,5.92355503 4.553332,5.51312747 C4.18378137,5.10269992 3.55148412,5.06956262 3.14105657,5.43911325 C-0.74448826,8.93767353 -1.07047076,14.9126382 2.41598202,18.7847363 C5.9024348,22.6568344 11.8787425,22.9571916 15.7642873,19.4586313 C19.6498321,15.960071 19.9758146,9.9851063 16.4893619,6.11300821 C14.9316592,4.38300417 12.8333517,3.32717366 10.5963152,3.06454316 L12.0700434,1.74500546 C12.4814986,1.37659929 12.5163967,0.744396785 12.1479905,0.332941632 C11.7795844,-0.0785135216 11.1473819,-0.113411623 10.7359267,0.254994541 L7.33294163,3.30193822 C6.88901946,3.6994145 6.88901946,4.39447285 7.33294163,4.79194914 L10.6912841,7.79892096 C11.1027392,8.16732713 11.7349417,8.13242903 12.1033479,7.72097387 C12.4717541,7.30951872 12.436856,6.67731621 12.0254008,6.30891005 L10.6673959,5.092988 Z"
                            id="Combined-Shape"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </v-btn>
        </div>
        <div class="bar-section">
          <!-- <label class="duration-time played" id="playedTime">0:34</label> -->
          <label class="duration-time played" id="playedTime">{{
            playedTime
          }}</label>
          <v-spacer>
            <!-- <v-progress-linear height="3" :value="47" class="player-bar" color-front="blue lighten-1" color-back="grey lighten-1"></v-progress-linear> -->
            <v-slider
              class="player-bar"
              v-model="progress"
              @click.native="seek(progress)"
            ></v-slider>
          </v-spacer>
          <!-- <label class="duration-time total" id="totalTime">2:40</label> -->
          <label class="duration-time total" id="totalTime">{{
            totalTime
          }}</label>
        </div>
      </div>
      <div class="reminder-section" v-if="showReminder">
        <div class="media d-flex">
          <div class="media__image"></div>
          <div class="media__content">
            <div class="media__title">Reminder!</div>
            <div class="media__description">
              Support your favorite artists & brands
            </div>
          </div>
        </div>
      </div>
    </v-flex>
    <v-flex xs12 sm4 md4 class="actions-section" text-xs-right>
      <v-tooltip top>
        <v-btn
          class="action-btn"
          slot="activator"
          @click.native="showShareModal = true"
        >
          <img src="/static/images/ic_share.svg" width="20" />
        </v-btn>
        <span>Share</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn
          class="action-btn"
          @click.native="showDownloadModal = true"
          slot="activator"
        >
          <img src="/static/images/ic_download.svg" width="20" />
        </v-btn>
        <span>Download</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn class="action-btn" @click.native="repostItem()" slot="activator">
          <img src="/static/images/ic_repost.svg" width="20" />
        </v-btn>
        <span>Repost</span>
      </v-tooltip>
      <!-- <v-tooltip top>
        <v-btn
          class="action-btn"
          :to="'/user/' + user.slug + '/chat'"
          slot="activator"
        >
          <svg
            width="26px"
            height="22px"
            viewBox="0 0 26 22"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g
              id="Design"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Music-Players-––-Preference-Order"
                transform="translate(-1832.000000, -50.000000)"
                stroke="#999"
                stroke-width="2"
              >
                <g id="Group-29" transform="translate(0.000000, 1.000000)">
                  <g
                    id="Group-28"
                    transform="translate(1820.000000, 35.000000)"
                  >
                    <g
                      id="ic_comment"
                      transform="translate(13.000000, 15.000000)"
                    >
                      <path
                        d="M21.6127793,4.27261224 C22.5021671,4.27261224 23.229514,4.99995918 23.229514,5.88934694 L23.229514,19.3162857 C23.229514,19.7309796 22.7282895,19.9387347 22.4348201,19.6452653 L19.9960446,17.2064898 L8.67890176,17.2064898 C7.789514,17.2064898 7.06216706,16.4791429 7.06216706,15.5897551 L7.06216706,5.88934694 C7.06216706,4.99995918 7.789514,4.27261224 8.67890176,4.27261224 L21.6127793,4.27261224 L21.6127793,4.27261224 Z"
                        id="Stroke-1"
                      ></path>
                      <path
                        d="M7.06192216,13.1380408 L1.82061224,13.1380408 C0.931632653,13.1380408 0.203877551,12.4106939 0.203877551,11.5213061 L0.203877551,1.82089796 C0.203877551,0.931510204 0.931632653,0.204163265 1.82061224,0.204163265 L14.754898,0.204163265 C15.6438776,0.204163265 16.3716327,0.931510204 16.3716327,1.82089796 L16.3716327,4.1315102"
                        id="Stroke-3"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </v-btn>
        <span>Chat</span>
      </v-tooltip> -->
      <download-modal
        v-if="showDownloadModal"
        :item="item"
        :track="track"
        :dismiss="dismissDownloadDialog"
      ></download-modal>
      <share-modal
        v-if="showShareModal"
        :item="item"
        :dismiss="dismissShareDialog"
      ></share-modal>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./player.ctrl.js"></script>
