<template>
  <div class="mobile-album-page">
    <mobile-header
      :show-menu="false"
      @open-menu="openMenu"
    />

    <div class="section" v-if="!loading">
      <div class="section__header">
        <canvas id="canvas" class="background-image"></canvas>
        <div id="back_image" class="background-overlay"></div>

        <div class="media">
          <div class="media__cover">
            <div class="image" :style="{'background-image': 'url(' + album.cover.url + ')'}"></div>
          </div>
          <div class="media__footer">
            <audio-player></audio-player>
            <div class="media__title">
              {{ album.name }}
            </div>
            <div class="media__subtitle">
              {{ album.user.display_name }}
              <v-icon v-if="isAlbumUserVerified">fa-check-circle</v-icon>
            </div>
          </div>
        </div>

        <v-list two-line>
          <template v-for="(track, trackIndex) in album.tracks">
            <v-list-tile
              avatar
              :key="`track-${track.id}`"
              @click="play(trackIndex)"
            >
              <v-list-tile-avatar>
                <v-icon v-if="isTrackPlaying(trackIndex)">pause</v-icon>
                <v-icon v-else>play_arrow</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
            <v-list-tile-title v-html="track.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="album.user.display_name"></v-list-tile-sub-title>
                <!-- <v-list-tile-sub-title v-html="track.index"></v-list-tile-sub-title> -->
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </div>
      <div class="section__content">
        <h3>
          Free streaming.<br>
          Free downloads.<br>
          No ads.
        </h3>
      </div>
      <div class="section__footer">
        <img src="/static/images/img_download_ios.svg">
      </div>
    </div>

    <mobile-footer v-if="!loading"/>

    <v-dialog
      v-model="showMenu"
      fullscreen
      transition="slide-x-reverse-transition"
    >
      <mobile-menu @close-menu="closeMenu"></mobile-menu>
    </v-dialog>
  </div>
</template>

<script src="./show.ctrl.js"></script>

<style lang="scss" scoped>
.mobile-album-page {
  .section {
    //display: flex;
    //height: 100vh;
    //flex-direction: column;
    display: block;
    color: #000;
    text-align: center;
    font-family: Montserrat, serif;

    &__header {
      flex: 0 0 auto;
      position: relative;
      padding-top: 80px;
      background-color: #000;
      color: #fff;

      .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw !important;
        height: 100% !important;
        // background: #414141;
        overflow: hidden;
        // opacity: 0.6;
        background-color: #000000;
        opacity: 0.8;
        div {
          width: 100%;
          height: 100%;
          opacity: 0.6;
          background-size: cover;
          -webkit-filter: blur(160px);
          -moz-filter: blur(160px);
          -o-filter: blur(160px);
          -ms-filter: blur(160px);
          filter: blur(160px);
        }
      }
      .background-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw !important;
        height: 100% !important;
        overflow: hidden;
        background-color: rgba(0,0,0,0.25);
      }
    }

    &__content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__footer {
      height: 120px;
      flex: 0 0 auto;
      img {
        height: 60px;
      }
    }

    h3 {
      margin: 40px 0;
      font-size: 26px;
      line-height: 30px;
    }
  }

  .aplayer {
    width: 90%;
    margin: 0 auto;
  }

  .aplayer__meta {
    margin-top: -6px;
  }

  .media {
    position: relative;
    z-index: 1;
    width: 100%;
    //height: 50%;
    //flex: 0 0 auto;
    padding: 0 20px;
    &__cover {
      position: relative;
      //width: 80%;
      //padding-top: 80%;
      width: 90%;
      padding-top: 90%;
      margin: 0 auto;
      margin-top: 4%;
      border-radius: 3px;
      overflow: hidden;

      .image {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('/static/images/album.jpg') no-repeat center center;
        background-size: contain;
      }
      .tag {
        position: absolute;
        bottom: 15px;
        right: 15px;
        padding: 4px 12px;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
        font-weight: 500;
      }
    }
    &__title {
      width: 100%;
      padding-top: 12px;
      padding-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      //text-align: left;
      white-space: nowrap;
      line-height: 16px;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -.4px;
    }
    &__subtitle {
      width: 100%;
      padding-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      //text-align: left;
      white-space: nowrap;
      line-height: 16px;
      font-size: 16px;
      font-weight: 300;
      .icon {
        margin-top: -10px;
        font-size: 12px;
        color: #7ed321;
      }
    }
  }

  .btn--flat {
    display: none;
  }

  .list {
    position: relative;
    z-index: 1;
    margin-top: 44px;
    padding: 0 0 40px 0;
    border-top: 1px solid #cccccc3d;
    background-color: transparent;
    color: #fff !important;

    /deep/ &__tile {
      height: 54px;
      padding: 0;
    }

    li {
      margin: 0 5px 0 20px;
      &:not(:last-child) {
        border-bottom: 1px solid #cccccc1f;
      }
    }

    &__tile {
      &__avatar {
        flex: 0 0 auto;
        .icon {
          color: #fff;
          height: 48px;
        }
      }
      &__title {
        color: #fff;
      }
      &__sub-title {
        color: #fff;
        display: none;
      }
    }
  }

  .header-container {
    position: absolute;
  }

  .footer-container {
    border-top: 1px solid #0000001f;
    padding: 15px 0 5px 0;
  }
}
</style>
