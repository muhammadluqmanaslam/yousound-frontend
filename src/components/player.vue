<template>
  <v-layout row wrap class="bottom-player" v-if="$store.getters['player/isPlaying']">
  <!-- <v-layout row wrap class="bottom-player" v-if="isStart"> -->
    <v-flex xs12 sm4 md4 class="track-detail-section">
      <router-link :to="`/${item.album_type}/${item.slug}`">
        <div class="track-cover-image" :style="{'background-image': 'url(' + item.cover.url + ')'}"></div>
      </router-link>
      <!-- <div class="track-cover-image" style="background-image: url('/static/images/post1.jpg')"></div> -->
      <div class="track-info-section">
        <div class="track-info">
          <label class="track-index" id="trackIndex">{{ trackIndex }}</label>
          <label class="track-name" id="trackName">{{ track.name }}</label>
        </div>
        <div class="user-info">
          <template v-if="item.collaborators_count > 0">
            <router-link class="user-name" :to="`/${item.album_type}/${item.slug}`">Multiple Collaborators</router-link>
          </template>
          <template v-else-if="item.album_type=='album'">
            <router-link class="user-name" :to = "'/' + item.user.slug">{{ item.user.display_name }}</router-link>
            <v-btn v-if="$store.state.auth.user && item.user.id!=$store.state.auth.user.id"
              :class="{ 'follow-btn': true, 'follow': !item.user.is_following, 'following': item.user.is_following }"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false"
              @click.native="followUser()">{{ followButtonText }}</v-btn>
          </template>
          <template v-else>
            <router-link class="user-name" :to = "'/' + track.user.slug">{{ track.user.display_name }}</router-link>
            <v-btn v-if="$store.state.auth.user && track.user.id!=$store.state.auth.user.id"
              :class="{ 'follow-btn': true, 'follow': !track.user.is_following, 'following': track.user.is_following }"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false"
              @click.native="followUser()">{{ followButtonText }}</v-btn>
          </template>
        </div>
      </div>
    </v-flex>
    <v-flex xs12 sm4 md4>
      <div class="loading" id="loading" v-if="!isLoaded"></div>
      <div class="player-section" v-if="isLoaded">
        <div class="controls-section">
          <v-tooltip top>
            <v-btn slot="activator" class="player-control-btn" @click.native="randomPlay()">
              <svg width="25px" height="20px" viewBox="0 0 25 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Music-Players-––-Preference-Order" transform="translate(-806.000000, -31.000000)" fill="#444444">
                          <g id="Group-29" transform="translate(0.000000, 1.000000)">
                              <g id="Group-20" transform="translate(612.000000, 22.000000)">
                                  <g id="Group-17" transform="translate(194.000000, 0.000000)">
                                      <path d="M21.3382513,21.5824203 L24.8187075,24.3638853 C24.932736,24.4543538 24.9999931,24.5919838 24.9999931,24.7373137 C24.9999931,24.8836051 24.932736,25.0202722 24.8187075,25.1117036 L21.3382513,27.8931686 C21.250537,27.9634272 21.1413799,28 21.0322085,28 C20.9610656,28 20.8889371,27.9846014 20.8226657,27.95284 C20.65308,27.8729572 20.5448943,27.7035672 20.5448943,27.5187773 L20.5448943,25.6910949 C20.3002515,25.7190063 19.9990945,25.7430677 19.6248231,25.7430677 C17.7398665,25.7430677 14.4192531,25.1511636 11.8266967,21.5189017 C12.2087537,20.9414305 12.571325,20.3023735 12.9104964,19.6017022 C15.7749813,24.4014195 19.8558231,23.8836254 20.5448943,23.7565826 L20.5448943,21.9558488 C20.5448943,21.7710588 20.65308,21.6016689 20.8226657,21.5217874 C20.9912799,21.4409446 21.1920513,21.4650017 21.3382513,21.5824203 Z M20.5448943,12.1591328 C19.8148802,12.0205328 14.830553,11.3381616 12.0011537,18.1031884 C9.09865452,25.0404836 3.73128881,25.748842 1.66406651,25.748842 C1.14750522,25.748842 0.837568156,25.7045692 0.82294816,25.701682 C0.290792588,25.6189121 -0.0717758871,25.1261408 0.0120440905,24.6016081 C0.0948883541,24.0780382 0.589033936,23.7190469 1.12216379,23.800854 C1.36485087,23.8355025 7.17568504,24.5958338 10.1990399,17.3678743 C13.2555248,10.0590762 18.7778662,10.0263477 20.5448943,10.2226905 L20.5448943,8.4816195 C20.5448943,8.29683383 20.65308,8.12744816 20.8226657,8.04756247 C20.9912799,7.96574821 21.1920513,7.99173391 21.3382513,8.10819102 L24.8187075,10.8887046 C24.932736,10.9801331 24.9999931,11.1177616 24.9999931,11.2630902 C24.9999931,11.4084187 24.932736,11.5460472 24.8187075,11.6374758 L21.3382513,14.4189465 C21.250537,14.4892036 21.1413799,14.525775 21.0322085,14.525775 C20.9610656,14.525775 20.8889371,14.510375 20.8226657,14.4786179 C20.65308,14.3987322 20.5448943,14.2293465 20.5448943,14.0445609 L20.5448943,12.1591328 Z M1.12606236,12.1148471 C0.601703933,12.2034042 0.0958626395,11.83959 0.0120440905,11.3150616 C-0.0717758871,10.7895617 0.290792588,10.2967904 0.82294816,10.214019 C0.886301,10.2024762 6.22248243,9.44791924 10.0664828,14.4266465 C9.70684007,15.0108463 9.37058302,15.6672319 9.05285453,16.3746317 C5.86576253,11.4584616 1.17966806,12.1100471 1.12606236,12.1148471 Z" id="Clip-2"></path>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </g>
              </svg>
            </v-btn>
            <span>Play random albums</span>
          </v-tooltip>
          <v-btn class="player-control-btn" @click.native="skip('prev')">
            <svg width="17px" height="20px" viewBox="0 0 17 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Music-Players-––-Preference-Order" transform="translate(-881.000000, -31.000000)" fill="#444444">
                        <g id="Group-29" transform="translate(0.000000, 1.000000)">
                            <g id="Group-20" transform="translate(612.000000, 22.000000)">
                                <g id="Group-17" transform="translate(194.000000, 0.000000)">
                                    <path d="M88.3333333,18.7692308 L75,28 L75,8 L88.3333333,17.2307692 L88.3333333,10.2222222 L91.6666667,10.2222222 L91.6666667,26.8888889 L88.3333333,26.8888889 L88.3333333,18.7692308 Z" id="Combined-Shape-Copy" transform="translate(83.333333, 18.000000) rotate(-180.000000) translate(-83.333333, -18.000000) "></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
          </v-btn>
          <v-btn class="player-control-btn play" @click.native="$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)" id="play" v-if="!isPlaying">
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn class="player-control-btn pause" id="pause" v-if="isPlaying" @click.native="pause()">
            <v-icon>pause</v-icon>
          </v-btn>
          <v-btn class="player-control-btn" @click.native="skip('next')">
            <svg width="17px" height="20px" viewBox="0 0 17 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Music-Players-––-Preference-Order" transform="translate(-1023.000000, -31.000000)" fill="#444444">
                        <g id="Group-29" transform="translate(0.000000, 1.000000)">
                            <g id="Group-20" transform="translate(612.000000, 22.000000)">
                                <g id="Group-17" transform="translate(194.000000, 0.000000)">
                                    <path d="M230.333333,18.7692308 L217,28 L217,8 L230.333333,17.2307692 L230.333333,10.2222222 L233.666667,10.2222222 L233.666667,26.8888889 L230.333333,26.8888889 L230.333333,18.7692308 Z" id="Combined-Shape"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
          </v-btn>
          <v-btn class="player-control-btn" :class="{'selected': isRepeated}" @click.native="setRepeated()">
            <svg width="19px" height="22px" viewBox="0 0 19 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Music-Players-––-Preference-Order" transform="translate(-1089.000000, -30.000000)" fill-rule="nonzero" fill="#444444">
                        <g id="Group-29" transform="translate(0.000000, 1.000000)">
                            <g id="Group-20" transform="translate(612.000000, 22.000000)">
                                <g id="Group-17" transform="translate(194.000000, 0.000000)">
                                    <g id="Group-24" transform="translate(283.000000, 7.000000)">
                                        <path d="M10.6673959,5.092988 C12.3150242,5.35561496 13.8472319,6.16757868 15.0030722,7.45126942 C17.749136,10.5010822 17.4921392,15.211601 14.4260261,17.9723416 C11.359913,20.7330823 6.64833546,20.4962879 3.90227167,17.4464751 C1.15620788,14.3966623 1.41320466,9.68614356 4.47931778,6.9254029 C4.88974534,6.55585228 4.92288263,5.92355503 4.553332,5.51312747 C4.18378137,5.10269992 3.55148412,5.06956262 3.14105657,5.43911325 C-0.74448826,8.93767353 -1.07047076,14.9126382 2.41598202,18.7847363 C5.9024348,22.6568344 11.8787425,22.9571916 15.7642873,19.4586313 C19.6498321,15.960071 19.9758146,9.9851063 16.4893619,6.11300821 C14.9316592,4.38300417 12.8333517,3.32717366 10.5963152,3.06454316 L12.0700434,1.74500546 C12.4814986,1.37659929 12.5163967,0.744396785 12.1479905,0.332941632 C11.7795844,-0.0785135216 11.1473819,-0.113411623 10.7359267,0.254994541 L7.33294163,3.30193822 C6.88901946,3.6994145 6.88901946,4.39447285 7.33294163,4.79194914 L10.6912841,7.79892096 C11.1027392,8.16732713 11.7349417,8.13242903 12.1033479,7.72097387 C12.4717541,7.30951872 12.436856,6.67731621 12.0254008,6.30891005 L10.6673959,5.092988 Z" id="Combined-Shape"></path>
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
          <label class="duration-time played" id="playedTime">{{ playedTime }}</label>
          <v-spacer>
            <!-- <v-progress-linear height="3" :value="47" class="player-bar" color-front="blue lighten-1" color-back="grey lighten-1"></v-progress-linear> -->
            <v-slider class="player-bar" v-model="progress" @click.native="seek(progress)"></v-slider>
          </v-spacer>
          <!-- <label class="duration-time total" id="totalTime">2:40</label> -->
          <label class="duration-time total" id="totalTime">{{ totalTime }}</label>
        </div>
      </div>
    </v-flex>
    <v-flex xs12 sm4 md4 class="actions-section" text-xs-right>
      <v-tooltip top>
        <v-btn class="action-btn" slot="activator" @click.native="showShareModal=true">
          <svg width="19px" height="24px" viewBox="0 0 19 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                  <g id="Music-Players-––-Preference-Order" transform="translate(-1626.000000, -49.000000)" stroke="#444444" stroke-width="2">
                      <g id="Group-29" transform="translate(0.000000, 1.000000)">
                          <g id="Group-25" transform="translate(1610.000000, 35.000000)">
                              <g id="Group-23" transform="translate(17.000000, 14.000000)">
                                  <polyline id="Path-4" points="0 7.84687355 7.84687355 0 16.0848485 8.23797495"></polyline>
                                  <path d="M8,2 L8.22007757,15.1724323 C8.20675907,19.362821 10.8240604,21.4617746 16.0719814,21.4692931" id="Path-3"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </v-btn>
        <span>Share</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn class="action-btn" @click.native="showDownloadModal=true" slot="activator">
          <svg width="19px" height="24px" viewBox="0 0 19 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                  <g id="Music-Players-––-Preference-Order" transform="translate(-1696.000000, -49.000000)" stroke="#444444" stroke-width="2">
                      <g id="Group-29" transform="translate(0.000000, 1.000000)">
                          <g id="Group-26" transform="translate(1680.000000, 35.000000)">
                              <g id="Group-23-Copy" transform="translate(25.500000, 25.000000) rotate(-180.000000) translate(-25.500000, -25.000000) translate(17.000000, 14.000000)">
                                  <polyline id="Path-4" points="0 7.84687355 7.84687355 0 16.0848485 8.23797495"></polyline>
                                  <path d="M8,2 L8.22007757,15.1724323 C8.20675907,19.362821 10.8240604,21.4617746 16.0719814,21.4692931" id="Path-3"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </v-btn>
        <span>Download</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn class="action-btn" @click.native="repostItem()" slot="activator">
          <svg width="24px" height="20px" viewBox="0 0 24 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Music-Players-––-Preference-Order" transform="translate(-1763.000000, -51.000000)" fill="#444444">
                      <g id="Group-29" transform="translate(0.000000, 1.000000)">
                          <g id="Group-27" transform="translate(1750.000000, 35.000000)">
                              <path d="M35.3534522,24.450486 C35.8429936,24.420565 36.2837921,24.7701682 36.3232088,25.2639522 C36.3323591,25.3817114 36.5303225,28.1267443 34.64096,30.1604973 C33.3898314,31.5064173 31.5618815,32.1561054 29.207789,32.1561054 L18.3887823,32.1561054 L18.3887823,34.5503101 C18.3887823,34.723362 18.1964499,34.8813659 18.039135,34.9560809 C17.9773704,34.9860019 17.8186478,35 17.752308,35 C17.6507748,35 17.5499455,34.9657046 17.4677687,34.8999134 L13.643996,31.8232999 C13.5380636,31.7380863 13.476123,31.6098284 13.476123,31.4736966 C13.476123,31.3373899 13.5380636,31.209132 13.643996,31.1239184 L17.4677687,28.0473049 C17.6030876,27.9393444 17.8828759,27.9155475 18.039135,27.9911374 C18.1964499,28.0658524 18.3887823,28.2240313 18.3887823,28.3970831 L18.3887823,30.581316 L29.207789,30.581316 C31.02958,30.581316 32.4065253,30.0126421 33.3011438,29.0576198 C34.6546854,27.6124881 34.5204223,25.4555516 34.5190145,25.4343794 C34.4836451,24.9398955 34.8565201,24.4874061 35.3534522,24.450486 Z M13.9797193,25.5451396 C13.4903538,25.5748856 13.0493794,25.2275571 13.0101387,24.7337731 C13.0008124,24.6160139 12.802849,21.8543582 14.6922115,19.8204303 C15.9433401,18.4745103 17.77129,17.8080244 20.1253825,17.8080244 L30.9341831,17.8080244 L30.9341831,15.4496899 C30.9341831,15.276638 31.1316186,15.1184592 31.2889335,15.0439191 C31.350698,15.0139981 31.5146997,15 31.5808635,15 C31.6825727,15 31.783226,15.0341204 31.8654028,15.1000866 L35.6891755,18.1767001 C35.7952839,18.2619137 35.8570485,18.3901716 35.8570485,18.5263034 C35.8570485,18.6624351 35.7952839,18.790693 35.6891755,18.8760816 L31.8654028,21.9525201 C31.7302598,22.0606556 31.4453685,22.0844525 31.2889335,22.0088626 C31.1316186,21.9341476 30.9341831,21.7759687 30.9341831,21.6029169 L30.9341831,19.3828138 L20.1253825,19.3828138 C18.3035915,19.3828138 16.9266462,19.9695103 16.0322037,20.9243576 C14.678662,22.3696643 14.8129252,24.5355246 14.814157,24.5565218 C14.8495264,25.0511807 14.4766514,25.5082195 13.9797193,25.5451396 Z" id="ic_repeat"></path>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </v-btn>
        <span>Repost</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn class="action-btn" :to="'/user/' + user.slug + '/chat'" slot="activator">
          <svg width="26px" height="22px" viewBox="0 0 26 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Music-Players-––-Preference-Order" transform="translate(-1832.000000, -50.000000)" stroke="#444444" stroke-width="2">
                      <g id="Group-29" transform="translate(0.000000, 1.000000)">
                          <g id="Group-28" transform="translate(1820.000000, 35.000000)">
                              <g id="ic_comment" transform="translate(13.000000, 15.000000)">
                                  <path d="M21.6127793,4.27261224 C22.5021671,4.27261224 23.229514,4.99995918 23.229514,5.88934694 L23.229514,19.3162857 C23.229514,19.7309796 22.7282895,19.9387347 22.4348201,19.6452653 L19.9960446,17.2064898 L8.67890176,17.2064898 C7.789514,17.2064898 7.06216706,16.4791429 7.06216706,15.5897551 L7.06216706,5.88934694 C7.06216706,4.99995918 7.789514,4.27261224 8.67890176,4.27261224 L21.6127793,4.27261224 L21.6127793,4.27261224 Z" id="Stroke-1"></path>
                                  <path d="M7.06192216,13.1380408 L1.82061224,13.1380408 C0.931632653,13.1380408 0.203877551,12.4106939 0.203877551,11.5213061 L0.203877551,1.82089796 C0.203877551,0.931510204 0.931632653,0.204163265 1.82061224,0.204163265 L14.754898,0.204163265 C15.6438776,0.204163265 16.3716327,0.931510204 16.3716327,1.82089796 L16.3716327,4.1315102" id="Stroke-3"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
        </v-btn>
        <span>Chat</span>
      </v-tooltip>
      <download-modal :item="item" :track="track" :dismiss="dismissDownloadDialog" v-if="showDownloadModal"></download-modal>
      <share-modal :item="item" :dismiss="dismissShareDialog" v-if="showShareModal"></share-modal>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript">
import { mapActions } from 'vuex'
import { Howl } from 'howler'
import AlbumService from '@/services/album'
import UserService from '@/services/user'
import { MyEvents } from '@/helper'
import downloadModal from '@/components/downloadmodal'
import shareModal from '@/components/sharemodal'

export default {
  components: {
    downloadModal,
    shareModal
  },

  data () {
    return {
      playlist: [],
      index: 0,
      isLoaded: false,
      isRepeated: false,
      isPlaying: false,
      trackIndex: null,
      trackName: null,
      track: {},
      playedTime: 0,
      progress: 0,
      showDownloadModal: false,
      showShareModal: false,
      totalTime: null,
      buttonHover: false
    }
  },

  computed: {
    MyEvents () {
      return MyEvents
    },

    item () {
      const item = this.$store.state.player.list[this.$store.state.player.listIndex]
      if (item !== null && item !== undefined) {
        if (item.assoc_type) {
          return item.assoc
        } else {
          return item
        }
      }
      return null
    },

    user () {
      if (!this.item) {
        return null
      }

      if (this.item.album_type === 'album') {
        return this.item.user
      } else {
        return this.track.user
      }
    },

    followButtonText () {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    }
  },

  created () {
  },

  methods: {
    ...mapActions({
      setPlaying: 'player/setPlayingStatus',
      setPauseStatus: 'player/setPauseStatus'
    }),

    startPlaying (index) {
      this.setPlaylist('next')
      this.play(index)
      this.$forceUpdate()
    },

    resetPlayer () {
      if (this.$store.state.player.isPlaying) {
        this.setPlaying(false)
        this.pause()
        this.setPauseStatus(false)
        this.$store.dispatch('player/setPlaylist', [])
        this.$store.dispatch('player/setListIndex', -1)
        this.$store.dispatch('player/setTrackIndex', -1)
        for (let index in this.playlist) {
          let item = this.playlist[index]
          if (item) {
            if (item.howl) {
              item.howl.unload()
            }
          }
        }
        this.playlist = []
        this.index = 0
        this.isLoaded = false
        this.isRepeated = false
        this.isPlaying = false
        this.trackIndex = null
        this.trackName = null
        this.track = {}
        this.playedTime = 0
        this.progress = 0
        this.showDownloadModal = false
        this.totalTime = null
        this.buttonHover = false
      }
    },

    play (index) {
      console.log('player', index, this.index, this.playlist)
      var self = this
      var sound
      index = typeof index === 'number' ? index : this.index
      var data = this.playlist[index]

      // If we already loaded self track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        sound = data.howl
      } else {
        sound = data.howl = new Howl({
          src: data.track.audio.url,
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onplay: function () {
            // Display the duration.
            self.totalTime = self.formatTime(Math.round(sound.duration()))

            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(this))

            // Start the wave animation if we have already loaded
            self.isPlaying = true
            self.setPauseStatus(false)
          },
          onload: function () {
            // Start the wave animation.
            self.isLoaded = true
          },
          onend: function () {
            // Stop the wave animation.
            // this.isLoaded = false
            // this.isPlaying = false
            if (self.isRepeated) {
              self.skipTo(self.index)
            } else {
              self.skip('right')
            }
          },
          onpause: function () {
            // Stop the wave animation.
            // this.isPlaying = false
          },
          onstop: function () {
            // Stop the wave animation.
            // this.isPlaying = false
          }
        })
      }

      // Begin playing the sound.
      sound.play()

      // Update the track display.
      // track.innerHTML = (index + 1) + '. ' + data.title
      // this.trackName = this.playlist[index].track.name
      this.trackIndex = (index + 1) + ' of ' + this.playlist.length
      this.track = this.playlist[index].track

      // Show the pause button.
      if (sound.state() === 'loaded') {
        this.isPlaying = true
      } else {
        this.isLoaded = false
        this.isPlaying = false
      }

      // Keep track of the index we are currently playing.
      this.index = index
      this.$store.dispatch('player/setTrackIndex', index)
    },

    /**
     * Pause the currently playing track.
     */
    pause () {
      // player is not initialized yet.
      if (!this.$store.state.player.isPlaying) return

      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl

      // Puase the sound.
      sound.pause()

      // Show the play button.
      this.isPlaying = false
      this.setPauseStatus(true)
      // this.setPlaying(false)
    },

    skip (direction) {
      // Get the next track based on the direction of the track.
      var index = 0
      if (direction === 'prev') {
        index = this.index - 1
        if (index < 0) {
          this.$store.dispatch('player/setListIndex', this.$store.state.player.listIndex - 1)
          this.setPlaylist('prev')
          index = this.playlist.length - 1
          // this.$root.$emit('index_change')
        }
      } else {
        index = this.index + 1
        if (index >= this.playlist.length) {
          index = 0
          this.$store.dispatch('player/setListIndex', this.$store.state.player.listIndex + 1)
          this.setPlaylist('next')
          // this.$root.$emit('index_change')
        }
      }
      this.$store.dispatch('player/setTrackIndex', index)
      this.skipTo(index)
    },

    /**
     * Skip to a specific track based on its playlist index.
     * @param  {Number} index Index in the playlist.
     */
    skipTo (index) {
      // Stop the current track.
      var sound = null
      if (this.playlist[this.index] !== null && this.playlist[this.index] !== undefined) {
        if (this.playlist[this.index].howl !== undefined && this.playlist[this.index].howl !== null) {
          sound = this.playlist[this.index].howl
          sound.stop()
        }
      }

      // Reset progress.
      this.progress = 0

      if (this.playlist.length > 0) {
        // Play the new track.
        this.play(index)
      }
    },

    /**
     * Seek to a new position in the currently playing track.
     * @param  {Number} per Percentage through the song to skip.
     */
    seek (per) {
      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl

      // Convert the percent into a seek position.
      if (sound.playing()) {
        sound.seek(sound.duration() * per / 100)
      }
    },

    /**
     * The step called within requestAnimationFrame to update the playback position.
     */
    step () {
      // Get the Howl we want to manipulate.
      var sound = null
      // var sound = this.playlist[this.index].howl
      if (this.playlist[this.index] !== null && this.playlist[this.index] !== undefined) {
        if (this.playlist[this.index].howl !== undefined && this.playlist[this.index].howl !== null) {
          sound = this.playlist[this.index].howl

          // Determine our current seek position.
          var seek = sound.seek() || 0
          this.playedTime = this.formatTime(Math.round(seek))
          this.progress = (((seek / sound.duration()) * 100) || 0)

          // If the sound is still playing, continue stepping.
          if (sound.playing()) {
            requestAnimationFrame(this.step.bind(this))
          }
        }
      }
    },

    setPlaylist (direction) {
      // Display the title of the first track.
      let object = this.$store.state.player.list[this.$store.state.player.listIndex]
      var tracks = []
      if (direction === 'next') {
        for (var i = this.$store.state.player.listIndex; i < this.$store.state.player.list.length; i++) {
          object = this.$store.state.player.list[i]
          if (object.assoc_type) {
            if (object.assoc_type !== 'ShopProduct') {
              tracks = object.assoc.tracks
              this.$store.dispatch('player/setListIndex', i)
              this.$root.$emit('index_change')
              break
            }
          } else {
            tracks = object.tracks
            this.$store.dispatch('player/setListIndex', i)
            this.$root.$emit('index_change')
            break
          }
        }
      } else {
        for (i = this.$store.state.player.listIndex; i >= 0; i--) {
          object = this.$store.state.player.list[i]
          if (object.assoc_type) {
            if (object.assoc_type !== 'ShopProduct') {
              tracks = object.assoc.tracks
              this.$store.dispatch('player/setListIndex', i)
              this.$root.$emit('index_change')
              break
            }
          } else {
            tracks = object.tracks
            this.$store.dispatch('player/setListIndex', i)
            this.$root.$emit('index_change')
            break
          }
        }
      }
      for (let index in this.playlist) {
        let item = this.playlist[index]
        if (item) {
          if (item.howl) {
            item.howl.unload()
          }
        }
      }
      this.playlist = []
      this.index = 0
      if (tracks.length > 0) {
        if (this.$store.state.auth.user) {
          const album = object.assoc || object
          AlbumService.playAlbum(album.id).then(response => (console.log('played', album.id)))
        }

        for (let track in tracks) {
          this.playlist.push({
            track: tracks[track],
            played: false,
            howl: null
          })
        }
        // if (this.$store.state.player.trackIndex > -1) {
        //   this.index = this.$store.state.player.trackIndex
        // }
        this.$store.dispatch('player/setTrackIndex', 0)
        this.trackIndex = (this.index + 1) + ' of ' + this.playlist.length
        // this.trackName = this.playlist[this.index].track.name
        this.track = this.playlist[this.index].track
      } else {
        this.$store.dispatch('player/setListIndex', -1)
        this.$store.dispatch('player/setPage', '')
        this.$store.dispatch('player/setTab', '')
        this.$store.dispatch('player/setPlayingStatus', false)
      }
    },

    formatTime (secs) {
      var minutes = Math.floor(secs / 60) || 0
      var seconds = (secs - minutes * 60) || 0

      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    },

    followUser () {
      if (this.user.is_following) {
        UserService.unfollowUser(this.user.id).then(response => {
          this.$store.dispatch('player/updateFollowingStatus', false)
          this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + this.user.display_name])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      } else {
        UserService.followUser(this.user.id).then(response => {
          this.$store.dispatch('player/updateFollowingStatus', true)
          this.$store.dispatch('error/showSuccessToast', ['You just followed ' + this.user.display_name])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    choosePage (path) {
      this.$router.push({ path: '/' + path })
    },

    dismissDownloadDialog () {
      this.showDownloadModal = false
    },

    dismissShareDialog () {
      this.showShareModal = false
    },

    setRepeated () {
      this.isRepeated = !this.isRepeated
    },

    repostItem () {
      AlbumService.repostAlbum(this.item.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.item.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    setFollowingStatus (userId, isFollowing) {
      // console.log('player setFollowingStatus', status)
      // console.log(this.user)
      if (this.user && this.user.id === userId) {
        this.$store.dispatch('player/updateFollowingStatus', isFollowing)
      }
    },

    skipTrack (index) {
      this.skipTo(index)
    },

    randomPlay () {
    }
  },

  mounted () {
    this.$root.$on(MyEvents.AUDIO_PLAYER_PLAY, this.startPlaying)
    this.$root.$on(MyEvents.AUDIO_PLAYER_REPLAY, this.play)
    this.$root.$on(MyEvents.AUDIO_PLAYER_PAUSE, this.pause)
    this.$root.$on(MyEvents.AUDIO_PLAYER_SKIPTO, this.skipTrack)
    this.$root.$on(MyEvents.AUTH_SIGNOUT, this.resetPlayer)
    this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)
    this.$root.$on(MyEvents.VIDEO_PLAYER_FULLSCREEN_ENTER, this.pause)
  }
}
</script>
