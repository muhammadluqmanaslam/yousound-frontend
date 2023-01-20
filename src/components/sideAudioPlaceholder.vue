<template>
    <div class="side-player-placeholder">
        <div class="side-player-placeholder__wrapper">
            <!-- <img :src="require('@/assets/player_radio.svg')" width="80%" alt=""> -->
            <div class="player_text">Hear What's Trending</div>
            
            <div class="cta__wrapper cursor-pointer" @click="loadFeeds('discover', 1)">
              <img src="../assets/triangle-down.svg" width="15">
                <span class="cta__text">Surprise me</span>
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
        per_page: 50,
      }
      const api_response = this.currentUser != null ? SearchService.searchDiscover(params) : SearchService.searchDiscoverPublicUser(params)
      api_response.then((response) => {
        this.albums = response.body.albums
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
        padding: 30px 15px;
        border-radius: 6px;

        .player_text{
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 30px;
          line-height: 44px;
          letter-spacing: -1%;
          text-align: left;
          color: rgba(255, 255, 255, 0.7);
        }
        
        img {
            margin: 0 auto;
        }

        .cta__wrapper {
            background-color:rgba(50, 52, 61, 1);
            border-radius: 100px;
            padding: 7px 0px;
            text-align: center;
            margin: 0 auto;
            width: 100%;
            margin: 0 auto;
            margin-top: 20px;
            height: 53px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;

            img{
              margin: 0;
              filter: invert(1);
            }

        }
        .cta__text {
            color: #fff;
            font-weight: 700;
            font-size: 16px;
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
