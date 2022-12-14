<template>
  <div class="page video-page index-page" :class="{isComp}">
    <discover-nav v-if="!isComp && !onMobile" pageName="video" searchShow='true'/>

    <!-- <content-top-header
      v-if="isPageReady"
      absolute
      class="__inner __doubleUl" height="35"
      :class="{'px-5': !isComp, 'pl-0': isComp}"
    >
      <template slot="topHeader">
        <ul :class="{'mr-3': !isComp}">
          <li v-if="isComp">
            <h1>Video</h1>
          </li>
          <template v-if="!isComp">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="isPageReady && onTab(tab.id)">{{ tab.title }}</label>
            </li>
          </template>

          <v-spacer v-if="isComp"></v-spacer>

          <li
            v-if="isComp" 
            class="cursor-pointer"
            @click="$router.push({name: 'VideoIndex'})"
          >
            View All
          </li>
        </ul>

        <ul v-if="!isComp && !onMobile" class="ml-5">
          <v-spacer></v-spacer>
          <li class="my-2">
            <v-menu
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              style="display: block"
              offset-y
            >
              <div slot="activator" class="genre-filter py-3">
                <span class="mr-3">Genre:</span>
                <span class="">{{ selected_genre.name }}</span>
                <v-icon right>keyboard_arrow_down</v-icon>
              </div>
              <v-list>
                <v-list-tile
                  v-for="genre in available_genres"
                  :key="genre.id"
                  @click.native="setTab(genre.id)"
                >
                  <div class="cursor-pointer px-3">
                    {{ genre.name }}
                  </div>
                </v-list-tile>
              </v-list>
            </v-menu>


          </li>
        </ul>
      </template>
    </content-top-header> -->

    <div class="page-content">
      <div class="music-banner-main" :style="`background: linear-gradient(180deg, rgba(33, 33, 33, 0.59) 0%, #000000 100%), url(${selectedVideo.cover.url})`">
        <v-container>
          <div class="dflex album-flex align-center">
            <div class="album-main-content">
              <div class="album-title-main mb-4">{{ selectedVideo.name }}</div>
              <div class="dflex align-center gap-10 album-group mb-4">
                <div>
                  <div class="album-group-image" style="background-image: url('../../assets/check_success.svg')"></div>
                </div>
                <div class="dflex align-center">
                  <div class="album-group-title">{{ selectedVideo.user.display_name }}</div>
                  <div class="ml-1">
                    <img src="../../assets/check_success.svg" width='12'>
                  </div>
                </div>
              </div>
              <div class="album-title-description mb-4">{{ selectedVideo.description }}</div>

              <div class="album-play dflex align-center gap-25">

                <v-btn class="album-play-icon ml-0" @click="verifyUser()">
                  <v-icon>
                    play_arrow
                  </v-icon>
                </v-btn>

                <div class="plus-icon main">
                  <img src="../../assets/plus.svg" width='15px'>
                </div>

                <div class="plus-icon">
                  Following
                </div>
              </div>
            </div>

          </div>
          <div class="slider-contain">
            <div class="dflex align-center gap-25">
              <div class="font-lg">
                Trending
              </div>
              <div class="view-all cursor-pointer" @click="displayAllTrendingVideos()">
                View All 
              </div>
            </div>
            <div class="mt-4">
            <VueSlickCarousel v-bind="slickOptions">
              <div v-for="video in trendingVideos" class="slider-main pr-3">
                <div class="slider-main-img" :class="[selectedVideo.id === video.id  ? 'active' : '']" @click="changeSelectedVideo(video)">
                  <img :src="video.cover.thumb.url" width="100%">
                  <div class="hover-absolute">
                    <div class="play-button-absolute">
                      <video-box
                        :hoverOverlay="false"
                        :item="video"
                        coverOnly
                      />
                    </div>
                  <div>
                    <img src="../../assets/plus.svg" width="15">
                  </div>
                  </div>

                </div>
              </div>
            </VueSlickCarousel>
          </div>

          </div>
        </v-container>
        <!-- <div class="video-container">
          <video autoplay muted loop id="video-demo">
            <source :src="demoVideo" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>
        </div> -->
      </div>
      <v-container fluid :grid-list-md="onMobile" px-0 pt-0>
        <div class="dflex justify-space-between align-center margin-top-x">
          <div class="text-big">
            New
          </div>
          <div class="text-small cursor-pointer">
            View all
          </div>
        </div>
        <v-layout row wrap v-if="!hideOtherVideos">
          <!-- <v-flex xs4 v-for="(video, i) in videos" :key="i" class="video-container top-3"> -->
          <v-flex 
            v-for="(video) in videos.slice(0,10)" 
            :key="video.name"
            class="video-container"
            :class="[!isComp ? 'video-container top-3 xs12 sm3' : 'pl-0 xs4', {side_fullwidth: onMobile}]"
          >
            <video-box class="_sliced-top" :hoverOverlay="false" :item="video" />
          </v-flex>
        </v-layout>

        <div class="dflex justify-space-between align-center margin-top-x">
          <div class="text-big">
            Popular
          </div>
          <div class="text-small cursor-pointer">
            View all
          </div>
        </div>
        <v-layout row wrap v-if="!hideOtherVideos">
          <!-- <v-flex xs4 v-for="(video, i) in videos" :key="i" class="video-container top-3"> -->
          <v-flex 
            v-for="(video) in videos.slice(0,10)" 
            :key="video.name"
            class="video-container"
            :class="[!isComp ? 'video-container top-3 xs12 sm3' : 'pl-0 xs4', {side_fullwidth: onMobile}]"
          >
            <video-box class="_sliced-top" :hoverOverlay="false" :item="video" />
          </v-flex>
        </v-layout>
      </v-container>

      <div v-if="!isComp" class="text-xs-center">
        <v-btn
          v-if="isPageReady"
          v-show="pagination.current_page < pagination.total_pages"
          @click.native="loadMore()"
          class="loadmore-btn"
          >Load More</v-btn
        >
      </div>
    </div>
    <v-dialog v-model="show_logout_modal" content-class="logout-modal">
      <logoutModal />
    </v-dialog>
  </div>
</template>

<script src="./index.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
.top-menu {
    margin: 0 !important;
}

.margin-top-x{
  margin-top: 60px;
}

.page-content{
  margin-top: 52px;
  width: 100%;
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

.music-banner-main{
  
  color: white;
  position: relative;
  margin-left: -16px;
  font-family: 'Inter';
  width: calc(100% + 32px);
  padding: 80px 50px 60px;
  background-size: cover !important;

  .video-container{

  }

  .slider-contain{
    margin-top: 80px;


    //Arrows setting

    .slider-main-img{
      border-radius: 2px;
      overflow: hidden;
      position: relative;

      &:hover{
        .hover-absolute{
          display: flex;
        }
      }
      .play-button-absolute{
        position: absolute;
        top: calc(50% - 25px);
        left: calc(50% - 45px);

        .play-video-button{
          width: 40px;
          height: 40px;
          background-color: black;
          border-radius: 50%;
          

          i{
            color: white;
            font-size: 30px;
          }
        }
      }

      .hover-absolute{
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.7);
        width: 100%;
        height: 100%;
        padding: 10px;
        display: none;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        gap: 20px;

 


        ._title{
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 200px;
        }
        ._price{
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 400;
        }

        @media screen and (max-width: 1400px){
          ._title{
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: bold;
          }
          ._price{
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
  
        }
      }

      &.active{
        border: 4px solid #fff;
        border-radius: 10px;
        overflow: hidden;
      }
    }

    .font-lg{
      font-size: 28px;
      font-weight: 700;
    }

    .view-all{
      font-size: 16px;
      font-weight: 700;
      color: white;
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
          min-width: inherit;

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
.tabs__bar {
    width: calc(100% + 72px);
    position: relative;
    .tabs__li {
      margin: 0 !important;
      .tabs__item--active {
        .chip {
          background-color: #030303;
          color: #ffffff;
        }
      }
    }
}
</style>
