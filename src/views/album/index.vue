<template>
  <div class="page albums-page mx-5" :class="{ isComp: isComp, onMobile}">
    <discover-nav v-if="!isComp && !onMobile" pageName="music" filterShow='true' :searchShow="this.$store.state.app.sideBarMini" />
    <div class="page-content" v-if="isPageReady">
      <div class="music-banner-main" :style="{background: 'linear-gradient(180deg, #000000 0%,' + mainAlbum.gradient_color + ' 100%)'}" v-if="(mainAlbum && !viewAllNew && !viewAllPopular && !viewAllTrending)">
        <v-container>
          <div class="dflex album-flex align-center" v-if="mainAlbum">
            <div class="album-main-image">
              <img :src="mainAlbum.cover && mainAlbum.cover.url" width="100%">
            </div>

            <div class="album-main-content" v-if="mainAlbum">
              <div class="album-title-main mb-4">'{{ mainAlbum.name }}'</div>
              <div class="dflex align-center gap-10 album-group mb-4">
                <div>
                  <div class="album-group-image" style="background-image: url(mainAlbum.user.avatar.url)"></div>
                </div>
                <div class="dflex align-center">
                  <div class="album-group-title" v-if="mainAlbum.user">{{ mainAlbum.user.username }}</div>
                  <div class="ml-1">
                    <img src="../../assets/check_success.svg" width='12'>
                  </div>
                </div>
              </div>
              <div class="album-title-description mb-4">{{ mainAlbum.description }} • {{ mainAlbum.tracks.length }} {{ mainAlbum.tracks.length > 1 ? 'tracks' : 'track' }} </div>

              <div class="album-play dflex align-center gap-25">
                <span class="play-button-section">
                  <v-btn
                    dark
                    class="play-button"
                    @click.native="playSong()"
                    v-if="!isPlaying() || $store.state.player.isPaused"
                  >
                    <v-icon class="play">play_arrow</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    class="play-button"
                    @click.native="pauseSong()"
                    v-if="isPlaying() && !$store.state.player.isPaused"
                  >
                    <v-icon class="pause">pause</v-icon>
                  </v-btn>
                </span>

                <div class="plus-icon main" @click="repostAlbum()">
                  <img src="../../assets/plus.svg" width='15px'>
                </div>

                <div class="following-btn" v-if="mainAlbum.user && currentUser">
                  <user-follow-btn
                    v-if="mainAlbum.user.id !== currentUser.id"
                    :user="mainAlbum.user"
                    type="default"
                    borderRadius
                  />
                </div>
              </div>
            </div>

          </div>
          <div class="slider-contain" v-if="!viewAllTrending">
            <div class="dflex align-center gap-25">
              <div class="font-lg">
                Trending
              </div>
              <div class="view-all cursor-pointer" @click="displayTrendingTracks()">
                View all
              </div>
            </div>
            <div class="mt-4">
            <VueSlickCarousel v-bind="slickOptions">
              <div v-for="(recommended, index) in recommendedAlbums" class="slider-main pr-3">
                <div @click="changeMainAlbum(recommended)"
                  class="slider-main-img"
                  :class="[mainAlbum.id === recommended.id  ? 'slider-main-img active' : 'slider-main-img']"
                  :key="index"
                >
                  <track-card
                    :objects="recommendedAlbums"
                    :objectIndex="index"
                    :hideButtonAction="hideAlbum"
                    hideMoreMenu
                    noAction
                  />
                </div>
              </div>
            </VueSlickCarousel>
          </div>

          </div>
        </v-container>
      </div>
      <div class="global-header-viewall" v-if="(viewAllNew || viewAllPopular || viewAllTrending)">
        <div class="dflex align-center">
          <div class="highlight-head mr-4 dflex align-center">
            {{ viewAllNew ? 'New' : viewAllPopular ? 'Popular' : 'Trending' }}
            <img class="ml-1 mt-1" src="../../assets/triangle-down.svg" width="8">
          </div>
          <ul v-if="currentUser" v-for="genre in this.chosenGenres" class="dflex tablist">
            <li class="tab">
              <label>{{ genre.name }}</label>
            </li>
          </ul>
        </div>
      </div>
      <v-container fluid grid-list-lg px-0 v-if="viewAllTrending">
        <v-layout row wrap>
          <v-flex
            v-for="(feed, index) in recommendedAlbums"
            :key="index"
            feed-card
            xs6
            custom-lg5
            px-0
          >
            <track-card
              :objects="recommendedAlbums"
              :objectIndex="index"
              :hideButtonAction="hideAlbum"
              hideMoreMenu
            />
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid grid-list-lg px-0 v-if="(!viewAllPopular && !viewAllTrending)">
        <div class="dflex justify-space-between align-center mt-4" v-if="(!viewAllNew && !viewAllTrending && !viewAllPopular)">
          <div class="text-big">
            New
          </div>
          <div class="text-small cursor-pointer" @click="displayNewTracks()">
            View all
          </div>
        </div>
        <v-layout row wrap>
          <v-flex
            v-for="(feed, index) in newAlbums"
            :key="index"
            feed-card
            sm3
            custom-lg5
            px-0
          >
            <track-card
              :objects="newAlbums"
              :objectIndex="index"
              :hideButtonAction="hideAlbum"
              hideMoreMenu
            />
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid grid-list-lg px-0 v-if="(!viewAllNew && !viewAllTrending)">
        <div class="dflex justify-space-between align-center margin-top-x" v-if="(!viewAllNew && !viewAllTrending && !viewAllPopular)">
          <div class="text-big">
            Popular
          </div>
          <div class="text-small cursor-pointer" @click="displayPopularTracks()">
            View all
          </div>
        </div>
        <v-layout row wrap>
          <v-flex
            v-for="(feed, index) in popularAlbums"
            :key="index"
            feed-card
            sm3
            custom-lg5
            px-0
          >
            <track-card
              :objects="popularAlbums"
              :objectIndex="index"
              :hideButtonAction="hideAlbum"
              hideMoreMenu
            />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div v-else>
      <figure>
        <div class="dot white"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </figure>
    </div>
    <v-dialog
      v-if="currentUser"
      v-model="show_genre_selector_dialog"
      :fullscreen="onMobile"
      :content-class="[`my-genre-dialog ma-0 pa-2 ${onMobile ? 'onMobile' : ''}`]"
    >
      <genre-dialog :dismiss="closeGenreSelectorDialog" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<style lang="scss" scoped>
body { background: #222; }
figure { 
	position: absolute;
	margin: auto;
	margin-top: 33%;
	top: 0; bottom: 0; left: 0; right: 0;
	width: 6.250em; height: 6.250em;
	animation: rotate 2.4s linear infinite;
}
.white {
	top: 0; bottom: 0; left: 0; right: 0;
	background: white;
	animation: flash 2.4s linear infinite;
	opacity: 0;
}
.dot {
	position: absolute;
	margin: auto;
	width: 2.4em; height: 2.4em;
	border-radius: 100%;
	transition: all 1s ease;
}
.dot:nth-child(2) { top: 0; bottom: 0; left: 0; background: #FF4444; animation: dotsY 2.4s linear infinite; }
.dot:nth-child(3) { left: 0; right: 0; top: 0; background: #FFBB33; animation: dotsX 2.4s linear infinite; }
.dot:nth-child(4) { top: 0; bottom: 0; right: 0; background: #99CC00; animation: dotsY 2.4s linear infinite; }
.dot:nth-child(5) { left: 0; right: 0; bottom: 0; background: #33B5E5; animation: dotsX 2.4s linear infinite; }

@keyframes rotate {
	0% { transform: rotate( 0 ); }
	10% { width: 6.250em; height: 6.250em; }
	66% { width: 2.4em; height: 2.4em; }
	100%{ transform: rotate(360deg); width: 6.250em; height: 6.250em; }
}

@keyframes dotsY {
	66% { opacity: .1; width: 2.4em; }
	77%{ opacity: 1; width: 0; }
}
@keyframes dotsX {
	66% { opacity: .1; height: 2.4em;}
	77%{ opacity: 1; height: 0; }
}

@keyframes flash {
	33% { opacity: 0; border-radius: 0%; }
	55%{ opacity: .6; border-radius: 100%; }
	66%{ opacity: 0; }
}
.margin-top-x{
  margin-top: 60px;
}

.page-content{
  margin-top: 52px;
}

.slick-prev, .slick-next{
  width: 50px !important;
  height: 50px !important;
  background: rgba(255,255,255,0.15) !important;
  
  &::before{
    font-family: none !important;
  }
}


.music-banner-main{
  color: white;
  position: relative;
  margin-left: -64px;
  font-family: 'Inter';
  width: calc(100% + 128px);
  padding: 80px 50px 60px;

  .slider-contain{
    margin-top: 80px;


    //Arrows setting

    .slider-main-img{
      border-radius: 2px;
      overflow: hidden;

      &.active{
        border: 2px solid #fff;
      }
    }

    .font-lg{
      font-size: 28px;
      font-weight: 700;
    }

    .view-all{
      font-size: 16px;
      font-weight: 700;
    }
  }

  .gap-10{
    gap: 10px;
  }

  .gap-25{
    gap: 25px;
  }

  .album-flex{
    gap: 60px;

    .album-main-image{
      width: 35%;
      min-width: 320px;
      max-width: 330px;
      border-radius: 10px;
      overflow: hidden;
    }

    .album-main-content{
      max-width: 540px;
      .album-title-main{
        font-size: 42px;
        font-weight: bold;
      }

      .album-title-description{
        font-size: 18px;
        font-weight: 500;
        line-height: 24px;
      }

      .album-group{
        .album-group-title{
          font-size: 16px;
          font-weight: bold;
        }

        .album-group-image{
          width: 32px;
          height: 32px;
          background-color: pink;
          border-radius: 50%;
          overflow: hidden;
        }
      }

      .album-play{
        .album-play-icon{
          width: 55px;
          height: 55px;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          cursor: pointer;

          i{
            width: 20px;
            color: black;
            font-size: 30px;
          }
        }
        .plus-icon{
          padding: 4px 8px;
          background-color: rgba(0,0,0,0.5);
          border-radius: 5px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter';
          cursor: pointer;

          &.main{
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
.albums-page.onMobile {
  .feed-card {
    // padding: 3px;
  }
}

.play-button-section {
  position: relative;
  .play-button {
    border: rgba(255, 255, 255, 0.5) solid 1px;
    border-radius: 100%;
    background: #fff !important;
    box-shadow: none;
    width: 50px;
    height: 50px;
    min-width: 50px;
    margin: 0;
    
    .btn__content {
      padding: 0;
    }
    img {
      // width: 100%;
      max-width: 60px;
    }
    .icon {
      &.play {
        font-size: 34px;
        color: #333;
      }
      &.pause {
        font-size: 34px;
        color: #333;
      }
    }
  }
}

.text-big{
  font-size: 32px;
  font-weight: 700;
  font-family: 'Inter';
  color: black;
}
.text-small{
  font-size: 20px;
  font-weight: 700;
  font-family: 'Inter';
  color: black;
  text-decoration: none;
}
.vertical-divider {
  margin: 0px;
  font-size: 14px;
  background-color: #000000;
  border-left: 1px solid #000000;
}
.top-menu {
  margin: 0 !important;

  .tabs__bar {
    .tabs__li {
      .tabs__item--active {
        .chip {
          background-color: #030303;
          color: #ffffff;
        }
      }
    }
  }

  .genre-dialog-selector {
    position: relative;
    width: 50px;
    display: flex;
    justify-content: flex-end;

    .genre-filter img {
      width: 20px;
      margin-top: 8px;
    }

    .tooltip {
      position: absolute;
      display: block;
      bottom: -63px;
      right: 48px;
      z-index: 9;
      width: 240px;
      padding: 0 0 10px 0;
      background-color: transparent;
      text-transform: initial;
      letter-spacing: -0.1px;
      .tooltip-arrow {
        position: absolute;
        top: -9px;
        right: -20px;
        width: 0;
        height: 0;
        margin: -2px;
        border-style: solid;
        // border-color: rgba(0, 0, 0, 0.2);
        border-color: #1e1e1e;
        border-width: 12px 12px 0;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        transform: rotate(180deg);
      }
      .tooltip-inner {
        position: relative;
        padding: 12px 12px 12px 12px;
        border-radius: 5px;
        // background-color: rgba(0, 0, 0, 0.2);
        background-color: #1e1e1e;
        color: #ffffff;
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
        width: 285px;
        margin-left: 12px;
        padding-left: 15px;
        a {
          position: absolute;
          top: 15px;
          right: 10px;
          padding: 5px 7px;
          border-radius: 5px;
          background-color: #4389f7;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
