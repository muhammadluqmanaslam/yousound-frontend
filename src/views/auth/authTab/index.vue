<template>
  <div class="page auth-page auth-tab no-top-nav no-side-space">
    <v-container grid-list-item auth-card allChildrenCenter px-0>
      <v-layout wrap row auth-card-wrapper align-center justify-center>
        <v-flex v-if="!onMobile" xs12 sm6 auth-card-child left-card sign-in-info>
          <div v-if="!onMobile">
            <img width="40%" src="/static/images/nav_logo_primary.png" alt="">

            <div class="mt-4 dflex align-center">
              <h3>Sign up</h3>
              <h3 class="mx-3">or</h3>
              <h3>
                <router-link to="/login">Login</router-link>
              </h3>
            </div>
          </div>
          
          <v-spacer></v-spacer>
          
          <div class="text-xs-center auth-img-wrapper">
            <img v-if="activeTab == 'everyone'" width="70%" src="/static/images/new_signup_img.svg" alt="">
            <img v-else width="70%" src="/static/images/new_signup_img2.svg" alt="">
          </div>
        </v-flex>

        <v-flex v-if="!register_success" xs12 sm6 lg4 auth-card-child right-card sign-in-info>
          <h1 v-if="onMobile" class="text-xs-center mb-4">Sign Up</h1>
          <div class="switch-btn-wrapper __collapsed">
            <v-btn
              depressed
              :round="activeTab == 'everyone'"
              class="ml-0 switch-btn transparent text-btn px-3"
              :class="[activeTab == 'everyone' ? 'black--text border-dark' : 'grey--text']"
              @click="activeTab = 'everyone'"
            >
              Listener
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              depressed
              :round="activeTab == 'artistBrand'"
              class="ml-0 switch-btn transparent text-btn px-3"
              :class="[activeTab == 'artistBrand' ? 'black--text border-dark' : 'grey--text']"
              @click="activeTab = 'artistBrand'"
            >
              Artist / Brand
            </v-btn>
          </div>

          <div v-if="activeTab == 'everyone'">
            <ListenerRegister />
          </div>

          <div v-if="activeTab == 'artistBrand'">
            <InviteRegister @invite-mode="setInviteMode" />
          </div>
        </v-flex>

        <v-flex v-else xs12 sm6 auth-card-child right-card sign-in-info>
          <div class="text-xs-center">
          <b>Check your email for confirmation</b>

          <br>
        
          <v-btn round depressed class="app-blue white--text">Open email</v-btn>
        </div>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- <v-container tab-container>
      <div
        v-if="inviteMode"
        class="invite-info"
        :class="{ inviteMode: inviteMode }"
      >
        <div v-if="inviter.username" class="inviter">
          You've been invited by <user-tag :user="inviter" /> to get verified
        </div>
        <h5>Create Your Verified Account</h5>
      </div>

      <v-layout row wrap justify-center sides>
        <v-flex xs4 bodyContent :class="{ inviteMode: inviteMode }">
          <div v-if="activeTab == 'everyone'" class="bodyContent everyone">
            <div class="__headline">
              <span>Signup to YouSound</span>
            </div>

            <div class="__subheadline">
              <div class="__subheadline_text">
                Join thousands of music lovers
              </div>
            </div>

            <div class="sideLists">
              <div v-for="(list, i) in sideLists" :key="i" class="sideList">
                <span class="sideList_bullet">●</span>
                <div>
                  <span class="sideList_title">{{ list.title }}</span>
                  <span class="sideList_content">{{ list.content }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else-if="activeTab == 'artistBrand'"
            class="bodyContent artistBrand invited"
          >
            <div class="__headline">
              <span>Signup to YouSound</span>
            </div>

            <div class="__subheadline">
              <div class="__subheadline_text">
                The best place for Artists & Brands.
              </div>
            </div>

            <div class="sideLists">
              <div v-for="(list, i) in sideLists" :key="i" class="sideList">
                <span class="sideList_bullet">●</span>
                <div>
                  <span class="sideList_title">{{ list.title }}</span>
                  <span class="sideList_content">{{ list.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-flex>
        <v-flex xs6 class="form-section" :class="{ inviteMode: inviteMode }">
          <v-tabs fixed centered v-model="activeTab" class="form-tabs">
            <v-tabs-bar class="">
              <v-tabs-slider class="yellow"></v-tabs-slider>
              <v-tabs-item key="everyone" href="#everyone">
                Everyone
              </v-tabs-item>
              <v-tabs-item key="artistBrand" href="#artistBrand">
                Artist / Brands
              </v-tabs-item>
            </v-tabs-bar>

            <v-tabs-items class="">
              <v-tabs-content key="everyone" id="everyone">
                <v-card flat>
                  <v-card-text>
                    <ListenerRegister />
                  </v-card-text>
                </v-card>
              </v-tabs-content>
              <v-tabs-content key="artistBrand" id="artistBrand">
                <v-card flat>
                  <v-card-text>
                    <InviteRegister @invite-mode="setInviteMode" />
                  </v-card-text>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container> -->
  </div>
</template>

<script type="text/javascript" src="./authTab.ctrl.js"></script>

<style lang="scss" scoped>
.auth-tab {
  .tab-container {
    max-width: 1000px;
    .bodyContent {
      // width: 40%;

      .__headline {
        height: 48px;
        border-bottom: 1px solid #e1e1e1;
        font-size: 1.5em;
        font-weight: 800;
        letter-spacing: -1px;
        display: flex;
        align-items: center;
      }
      .__subheadline {
        margin: 50px 0 20px;
        &_text {
          font-size: 1.3em;
          font-weight: 800;
          letter-spacing: -1px;
        }
      }
      &.artistBrand {
        .__subheadline {
          &_text {
            font-size: 2.2em;
            line-height: 1.3;
          }
        }
      }

      .sideLists {
        .sideList {
          display: flex;
          // align-items: center;
          margin-bottom: 20px;

          &_bullet {
            margin-top: 3px;
            margin-right: 10px;
          }
          &_title {
            font-size: 1.3em;
            font-weight: bolder;
          }
          &_content {
            color: #555555;
          }
        }
      }
      &.inviteMode {
        .__headline span {
          display: none;
        }
      }
    }

    .form-section {
      .form-tabs {
        /deep/.tabs__container {
          border-bottom: 1px solid #e1e1e1;

          .tabs__slider {
            height: 2px;
            bottom: -1px;
          }
        }
      }
      &.inviteMode {
        .form-tabs {
          /deep/.tabs__container {
            li {
              display: none;
            }
          }
        }
      }
    }
  }
}
.invite-info {
  text-align: center;
  margin-top: 5%;

  h5 {
    font-weight: 700;
    font-size: 24px;
    color: #2d2d2d;
    letter-spacing: -1.18px;
  }
}
</style>
