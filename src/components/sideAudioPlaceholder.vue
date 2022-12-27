<template>
    <div class="side-player-placeholder">
        <div class="side-player-placeholder__wrapper">
            <img :src="require('@/assets/player_radio.svg')" width="80%" alt="">
            
            <div class="cta__wrapper cursor-pointer" @click="loadFeeds('discover', 1)">
                <span class="cta__text">Play something new!</span>
            </div>
        </div>
        <div class="side-player-placeholder__action" v-if="isPlaying">
            <img :src="require('@/assets/ic_rewind_outline.svg')" class="_previous" alt="previous button">
            <img :src="require('@/assets/ic_play_outline.svg')" class="_play" alt="play button">
            <img :src="require('@/assets/ic_skip_outline.svg')" class="_skip" alt="skip button">

        </div>
    </div>
</template>

<script>
import SearchService from '@/services/search'
import { MyEvents } from '@/helper'
import { mapActions } from 'vuex'

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    playlists() {
      return this.$store.state.playlist.playlists
    },
  },

  data() {
    return {
      albums: [],
      albumIndex: 0,
      playlist: {
        name: '',
        image: null,
      },
      isPlaying: false,
    }
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: "player/setPlayingStatus",
    }),

    loadFeeds(tab, page) {
      const params = {
        filter: tab,
        page: page,
        genre: 'any',
        category: 'any',
        per_page: 100,
      }
      const api_response = this.currentUser != null ? SearchService.searchDiscover(params) : SearchService.searchDiscoverPublicUser(params)
      api_response.then((response) => {
        this.albums = response.body.albums
        localStorage.setItem("play", "random")
        this.playSong()
      })
      .catch((e) => {
        this.$store.dispatch('error/showLoadingActivity', false)
        console.log('discover error', e)
      })
    },

    playSong() {
      this.albumIndex = Math.floor(Math.random() * this.albums.length)
      console.log("================", this.albumIndex)
      this.setPlaylist(this.albums)
      this.setPlaylistIndex(this.albumIndex)
      this.setPlaying(true)
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY, 0)
    },

    pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
    },
  },
}
</script>

<style lang="scss" scoped>
.side-player-placeholder {
    padding-left: 12px;
    padding-right: 12px;

    &__wrapper {
        text-align: center;
        background-color: #242732;
        padding: 30px 15px;
        border-radius: 6px;
        
        img {
            margin: 0 auto;
        }

        .cta__wrapper {
            background-color: #DDDFE8;
            border-radius: 100px;
            padding: 7px 10px;
            text-align: center;
            margin: 0 auto;
            width: 80%;
            margin-top: 20px;
        }
        .cta__text {
            color: #000000;
            font-weight: 500;
        }
    }
    &__action {
        width: 60%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;

        img {
            width: 20px;
            cursor: pointer;

            &.play {
                width: 26px;
            }
        }
    }
}
</style>
