<template v-if="isPageReady">
  <div class="page discover-page product-index-page mx-5" :class="{ isComp: isComp}">
    <discover-nav v-if="!isComp && !onMobile" pageName="merch" :searchShow="this.$store.state.app.sideBarMini" />

    <div class="d-flex">
      <div v-if="!viewAllTrending" class="page-content">
        <div class="music-banner-main" :style="{background: 'linear-gradient(180deg, #000000 0%,' + mainProduct.gradient_color + ' 100%)'}">
          <v-container>
            <div class="dflex album-flex align-center" v-if="mainProduct">
              <div class="album-main-image">
                <img :src="mainProduct.covers[0].cover.url" width="100%">
              </div>
  
              <div class="album-main-content">
                <div class="album-title-main mb-4">'{{ mainProduct.name }}'</div>
                <div class="dflex align-center gap-10 album-group mb-4">
                  <div>
                    <div class="album-group-image" style="background-image: url('../../assets/check_success.svg')"></div>
                  </div>
                  <div class="dflex align-center">
                    <div class="album-group-title">{{ mainProduct.merchant.display_name }}</div>
                    <div class="ml-1">
                      <img src="../../assets/check_success.svg" width='12'>
                    </div>
                  </div>
                </div>
                <div class="album-title-description mb-3">{{ mainProduct.description }}</div>
                <div class="mb-4 dflex align-center gap-10">
                  <div class="album-title-description">
                    {{ mainProduct.category.name }}.
                  </div>
                  <div class="album-title-description">
                    ${{ mainProduct.price | formatNumber }}
                  </div>
                </div>
  
                <div class="album-play dflex align-center gap-25">

                  <v-btn class="album-play-icon ml-0" @click="addToCart()">Add to cart</v-btn>
  
                  <div class="plus-icon main" @click="addToCollections()">
                    <img src="../../assets/plus.svg" width='15px'>
                  </div>
  
                  <div class="plus-icon" v-if="mainProduct.merchant.id !== currentUser.id">
                    <user-follow-btn
                      :user="mainProduct.merchant"
                      type="default"
                      borderRadius
                    />
                  </div>
                </div>
              </div>
  
            </div>
            <div class="slider-contain">
              <div class="dflex align-center gap-25">
                <div class="font-lg">
                  Trending
                </div>
                <div class="view-all cursor-pointer" @click="displayAllTrendingProduct()">
                  View all 
                </div>
              </div>
              <div class="mt-4">
                <VueSlickCarousel v-bind="slickOptions">
                  <div v-for="(product, index) in trendingProducts" class="slider-main pr-3">
                    <div
                      class="slider-main-img"
                      :class="[mainProduct.id === product.id  ? 'slider-main-img active' : 'slider-main-img']"
                      :key="index"
                    >
                      <product-card
                        :dataObject="product"
                        :hideOverlay="true"
                        :showFullOverlay="false"
                        hideOptionCount
                        noMeta
                        altMetaPrice
                        @click.native="verifyUser(product)"
                      />
                    </div>
                  </div>

                </VueSlickCarousel>
            </div>
  
            </div>
          </v-container>
        </div>

        <div class="global-header-viewall pt-0">

          <v-container v-if="!viewAllTrending" fluid grid-list-md pl-0 style="margin-left: -10px">
            <div v-for="category in categories">
              <div class="dflex justify-space-between align-center margin-top-x">
                <div class="text-big">
                  {{ category.name }}
                </div>
                <div class="text-small cursor-pointer" @click="displayAllProduct(category)">
                  View all
                </div>
              </div>
              <v-layout row wrap>
                <v-flex xs6 sm4 lg3 v-for="product in products.filter(product => product.category.name === category.name).slice(0, 4)" :key="product.id">
                  <!-- <product-card :hideOverlay="true" :dataObject="feed" /> -->
                  <product-card
                    hideOverlay
                    :noMeta="onMobile"
                    :altMeta="onMobile"
                    :altMetaPrice="onMobile"
                    @click.native="verifyUser(product)"
                    :dataObject="product"
                  />
                </v-flex>
              </v-layout>
            </div>
          </v-container>
        </div>
      </div>

      <div v-else class="global-header-viewall">
        <v-container fluid grid-list-md pl-0 style="margin-left: -10px">
          <div class="dflex justify-space-between align-center margin-top-x">
            <div class="text-big">
              {{ selected_category ? selected_category.name : 'Trending Products' }}
            </div>
            <div>
              <router-link to="/" class="text-small">
                View all
              </router-link>
            </div>
          </div>
          <v-layout row wrap>
            <v-flex xs6 sm4 lg3 v-for="product in selected_category == null ? products : products.filter(product => product.category.name === selected_category.name)" :key="product.id">
              <!-- <product-card :hideOverlay="true" :dataObject="feed" /> -->
              <product-card
                hideOverlay
                :noMeta="onMobile"
                :altMeta="onMobile"
                :altMetaPrice="onMobile"
                @click.native="verifyUser(product)"
                :dataObject="product"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style lang="scss" scoped>

.margin-top-x{
  margin-top: 60px;
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

.page-content{
  margin-top: 52px;
  width: 100%;
}

.margin-top-x{
  margin-top: 60px;
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
  margin-left: -64px;
  font-family: 'Inter';
  width: calc(100% + 128px);
  padding: 80px 50px 60px;

  .slider-contain{
    margin-top: 80px;


    //Arrows setting

    .slider-main-img{
      border-radius: 12px;
      overflow: hidden;
      position: relative;

      &:hover{
        .hover-absolute{
          display: flex;
        }
      }

      .hover-absolute{
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.8);
        width: 100%;
        height: 100%;
        padding: 10px;
        display: none;
        flex-direction: column;
        justify-content: flex-end;
        gap: 10px;


        ._title{
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: bold;
        }
        ._price{
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
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
          padding: 10px 20px;
          border-radius: 60px;
          font-weight: bold;
          font-size: 14px;
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: black;

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
    // left: -41px;
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
