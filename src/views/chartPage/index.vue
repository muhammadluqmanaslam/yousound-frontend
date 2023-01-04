<template>
    <div class="page chart-page mx-5">
        <discover-nav v-if="!isComp && !onMobile" pageName="chart" :searchShow="this.$store.state.app.sideBarMini"/>

        <div class="page-content">
            <div class="chart_flex">
                <div class="w-70">
                    <h2 class="heading-charts">
                        YOUSOUND CHARTS
                    </h2>

                    <div class="charts_container">
                        <div class="chart_div">
                            <div class="chart_content">
                                <div class="chart_number">1</div>
                                <div>
                                    <div class="chart_name">
                                        Talk
                                    </div>
                                    <div class="chart_sub">
                                        Tribe Nohbi
                                    </div>
                                </div>
                            </div>
                            <div class="chart_icon">
                                <div class="_progress">
                                    <RadialProgress />
                                </div>
                                <div class="_image">
                                    <img src="../../assets/jacki.png" width="80" height="80">
                                </div>
                            </div>
                        </div>

                        <div class="chart_div">
                            <div class="chart_content">
                                <div class="chart_number">2</div>
                                <div>
                                    <div class="chart_name">
                                        Talk
                                    </div>
                                    <div class="chart_sub">
                                        Tribe Nohbi
                                    </div>
                                </div>
                            </div>
                            <div class="chart_icon">
                                <div class="_progress">
                                    <RadialProgress />
                                </div>
                                <div class="_image">
                                    <img src="../../assets/jacki.png" width="80" height="80">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-30">
                    <h2 class="heading-charts">
                        NOW PLAYING
                    </h2>

                    <div class="playbox_container">
                        <div class="playbox_image">
                            <img src="../../assets/jacki.png" width="100%">
                        </div>
                        <div class="playbox_content mt-1">
                            <div>
                                <div class="play-head">Talk</div>
                                <div class="play-sub">Tribe Nohbi</div>
                            </div>
                            <div class="play-number">
                                #2
                            </div>
                        </div>
                        <div class="divider my-3"></div>
                        <div class="product-actions">
                            <!-- <user-follow-btn class="follow-btx" theme="blue" type="product" borderRadius btnBlock/>             -->
                            <v-btn blue class="follow-btn">
                                Follow
                            </v-btn>
                            <v-tooltip top>
                              <span slot="activator" class="__actions pl-0">
                                <img
                                  src="../../assets/plus.svg"
                                  width="20"
                                  class="cursor-pointer mt-2 filter-invert"
                                  
                                />
                              </span>
                              <span>Add to wishlist</span>
                            </v-tooltip>
              
              
                          <v-tooltip top>
                            <span slot="activator" class="__actions pl-0">
                              <img
                                src="/static/images/ic_share.svg"
                                width="20"
                                class="cursor-pointer mt-2"
                              />
                            </span>
                            <span>Share</span>
                          </v-tooltip>

                        </div>
            
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="./chartPage.scss" lang="scss" scoped></style>
