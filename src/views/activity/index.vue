<template>
  <div class="page activity-page px-5">
    <content-top-header v-if="isPageReady">
      <template slot="topHeader">
        <ul>
          <li class="active">
            <label>Activity</label>
          </li>
        </ul>
      </template>
    </content-top-header>


    <div class="page-content" v-if="currentUser && isPageReady">
      <div v-if="!activities || activities.length == 0" class="empty-section">
        <p class="empty-title">No Activity</p>
        <p class="empty-description">
          This is where you'll see who followed, commented, and other
          activity.
        </p>
        <router-link to="/album" class="empty-discover-btn"
          >Discover</router-link
        >
      </div>
      <div v-else class="activity-item-wrapper">
        <div class="activity-item-parent">
          <div
            v-if="
              ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1
            "
           class="invite-header"
           >
            <div class="dflex align-center">
              <div class="round-avatar __logo" :style="{'background-image': 'url(' + youLogo + ')'}" width="30"> </div>
              <span class="__text">Invite your friends!</span>
            </div>
            <v-btn depressed class="btn-pill" @click="show_invite_dialog = true">Invite</v-btn>
          </div>

          <activity-item
            v-for="(activity, index) in activities.slice(0, 100)"
            :key="index"
            :activityItem="activity"
          />

          <!-- <div class="text-xs-center">
            <v-btn
              v-if="page_index < total_pages"
              @click.native="loadMore()"
              class="loadmore-btn"
              >Load More</v-btn
            >
          </div> -->
        </div>

        <div class="suggested-users">
          <h2 class="mb-3">Suggested people to follow</h2>
          <div v-for="(user, index) in 5" :key="index" class="suggested-user">
            <div class="dflex justify-space-between align-center">
              <user-tag :user="currentUser" showAvatar width="70px" height="70px" marginRight="20px" />

              <v-btn
                depressed
                round
                dark
                class="follow-btn"
                @click.native="followUser(user)"
              >
                Follow
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="show_invite_dialog"
      content-class="invite-dialog"
      width="440"
    >
      <v-card>
        <v-card-title class="headline">Invite Artist/Brand</v-card-title>
        <v-card-text
          >Link expires in 72 hours and can only be used once</v-card-text
        >
        <v-card-actions>
          <v-btn dark block color="black" @click.native="createInvitation()"
            ><v-icon class="mr-3">fa-link</v-icon> Copy Link</v-btn
          >
        </v-card-actions>
        <div v-show="link_copied" class="link-copied">link has been copied</div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style lang="scss" scoped>
.activity-page {
  // z-index: 10;
  // margin-left: 20px;
  // top: 10%;
  // position: fixed;
  // width: 35%;
  // height: 80%;
  // background-color: #32353F;
  // border-radius: 10px;

    &::before {
      // content: '';
      position: absolute;
      left: -9px;
      top: 15.5vh;
      width: 20px;
      height: 20px;
      background: #32353F;
      transform: rotateZ(45deg);
    }

    .invite-header {
      padding: 25px 0;
      position: relative;
      border-bottom: 1px solid hsla(0, 0%, 77.6%, 0.45);

      &::after {
        // content: '';
        width: calc(100% + 120px);
        position: absolute;
        bottom: 0;
        left: -60px;
        border-bottom: 1px solid hsla(0, 0%, 77.6%, 0.45);
      }

      & .__logo {
        background-color: black;
        background-size: 68%;
        width: 70px;
        height: 70px;
        margin-right: 20px;
      }

      & .__text {
        // color: #ffffff;
        font-size: 15px;
      }
    }

    .activity-item-parent {
      // position: relative;
      // padding: 0px 10%;
      // top: 10px;
      // margin: auto 0;
      // height: 685px;
      // width: 94%;
      // overflow-y: auto;
      // overflow-x: hidden;

      .invite-header {
        display: flex;
        justify-content: space-between;
      }

      /* width */
      &::-webkit-scrollbar {
        opacity: 1;
        width: 5px;
        position: absolute;
        left: -90px;
        margin-right: 80px;

        /* Track */
        &-track {
          background: transparent;
        }

        /* Handle */
        &-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 48px;
          

          /* Handle on hover */
          &:hover {
            background: #555;
          }
        }
      }
      
      &:hover {
        .activity-item-parent::-webkit-scrollbar {
          opacity: 1;
        }
      }
    }

    .suggested {
      &-users {
        margin-top: 40px;
      }
      &-user {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid hsla(0, 0%, 77.6%, 0.45);
      }
    }
}
@media (max-width: 810px) {
  .activity-page {
    width: 72%;

    &::before {
      top: 16vh;
    }
    .activity-item-parent {
      padding: 0 10px;
    }
  }

}
</style>
