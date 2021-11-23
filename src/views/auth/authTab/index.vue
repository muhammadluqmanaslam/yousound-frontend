<template>
  <div class="auth-tab allChildrenCenter minHeightScreen">
    <v-container tab-container>
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
          <!-- activeTab: {{ activeTab }} -->
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
    </v-container>
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
