<template>
  <div class="message space" :class="isOwn ? 'self' : 'other'">
    <div class="messaged-time">{{ toLocalTimeString(message.created_at) }}</div>
    <template v-if="message.attachment">
      <div class="message-section">
        <router-link :to="`/${message.sender.slug}`"
          ><div
            class="user-avatar-image"
            :style="{
              'background-image':
                'url(' + message.sender.avatar.thumb.url + ')',
            }"
          ></div
        ></router-link>
        <div class="message-content text">
          <label class="text-message" v-html="message.body"></label>
        </div>
        <div class="clear"></div>
      </div>

      <div class="message-section">
        <router-link :to="`/${message.sender.slug}`"
          ><div
            class="user-avatar-image"
            :style="{
              'background-image':
                'url(' + message.sender.avatar.thumb.url + ')',
            }"
          ></div
        ></router-link>

        <template v-if="message.attachment.attachment_type == 'repost'">
          <div class="message-content text request no-top-corner">
            <div>
              <div class="repost-status-section">
                <v-icon
                  v-if="
                    message.sender.id == currentUser.id &&
                    message.attachment.status == 'pending'
                  "
                  class="icon-close"
                  @click="removeRepostRequest(message)"
                  >close</v-icon
                >
                <div
                  v-if="
                    message.sender.id == currentUser.id ||
                    message.attachment.status != 'pending'
                  "
                >
                  <label class="status-title">Repost request: </label>
                  <span :class="message.attachment.status">{{
                    message.attachment.status
                  }}</span>
                </div>
                <div v-else>
                  <label class="status-title">Repost request: </label>
                  <v-btn
                    class="btn--accept"
                    @click.native="acceptRepostRequest(message)"
                    >Accept</v-btn
                  >
                  <v-btn
                    class="btn--deny"
                    @click.native="denyRepostRequest(message)"
                    >Deny</v-btn
                  >
                  <v-btn
                    class="btn--free"
                    @click.native="acceptRepostRequestOnFree(message)"
                    >Repost free</v-btn
                  >
                </div>
              </div>

              <div
                class="content-section"
                v-if="message.attachment.attachable_type == 'Album'"
              >
                <div class="repost-item-image">
                  <activity-album-card
                    :object="message.attachment.assoc"
                  ></activity-album-card>
                </div>
                <div class="info-section">
                  <label class="item-title">{{
                    message.attachment.assoc.name
                  }}</label>
                  <a class="item-user">{{ message.sender.display_name }}</a>
                </div>
              </div>
              <div
                class="content-section"
                v-else-if="message.attachment.attachable_type == 'ShopProduct'"
              >
                <div class="repost-item-image">
                  <activity-product-card
                    :object="message.attachment.assoc"
                    :price-show="false"
                  ></activity-product-card>
                </div>
                <div class="info-section">
                  <label class="item-title">{{
                    message.attachment.assoc.name
                  }}</label>
                  <a class="item-user">{{ message.sender.display_name }}</a>
                </div>
              </div>
            </div>
            <!-- <label class="text-message">{{ message.body }}</label> -->
          </div>
        </template>

        <template
          v-else-if="message.attachment.attachment_type == 'collaboration'"
        >
          <div class="message-content text request no-top-corner">
            <div>
              <!-- <div class="content-section" v-if="message.attachment.attachable_type=='User'"> -->
              <div class="content-section">
                <template v-if="message.attachment.attachable_type == 'Album'">
                  <!-- <div class="label-message-section">
                    <div class="label-message">
                      {{ message.attachment.assoc.user.display_name }} wants to
                      upload this album collaboration
                    </div>
                  </div> -->
                  <div class="repost-item-image">
                    <activity-album-card
                      :object="message.attachment.assoc"
                    ></activity-album-card>
                  </div>
                  <div class="info-section">
                    <label class="item-title">{{
                      message.attachment.assoc.name
                    }}</label>
                    <a class="item-user">{{ message.sender.display_name }}</a>
                  </div>
                  <div
                    class="artist-list"
                    v-if="message.attachment.assoc.collaborators.length > 0"
                  >
                    <div
                      v-for="c in message.attachment.assoc.collaborators"
                      :key="c.id"
                      class="artist"
                    >
                      <span>{{ c.user.display_name }}</span>
                      <span>{{ c.user_role }}</span>
                    </div>
                  </div>
                </template>
                <template
                  v-else-if="
                    message.attachment.attachable_type == 'ShopProduct'
                  "
                >
                  <!-- <div class="label-message-section">
                    <div class="label-message">
                      {{ message.attachment.assoc.merchant.display_name }} wants
                      to upload this product collaboration
                    </div>
                  </div> -->
                  <div class="repost-item-image">
                    <activity-product-card
                      :object="message.attachment.assoc"
                      :price-show="false"
                    ></activity-product-card>
                  </div>
                  <div class="info-section">
                    <label class="item-title">{{
                      message.attachment.assoc.name
                    }}</label>
                    <a class="item-user">{{ message.sender.display_name }}</a>
                  </div>
                  <div
                    class="artist-list"
                    v-if="message.attachment.assoc.collaborators.length > 0"
                  >
                    <div class="artist">
                      <span
                        >{{ message.attachment.assoc.merchant.display_name }}(
                        Owner )</span
                      >
                      <span
                        >{{ message.attachment.assoc.creator_share }} %</span
                      >
                    </div>
                    <div class="artist">
                      <span>Recoup Cost</span>
                      <span
                        >${{
                          message.attachment.assoc.creator_recoup_cost
                            | formatNumber
                        }}</span
                      >
                    </div>
                    <div
                      v-for="c in message.attachment.assoc.collaborators"
                      :key="c.id"
                      class="artist"
                    >
                      <span>{{ c.user.display_name }}</span>
                      <span>{{ c.user_share }} %</span>
                    </div>
                  </div>
                </template>

                <div class="repost-status-section label">
                  <div
                    v-if="
                      message.sender.id == currentUser.id ||
                      message.attachment.status != 'pending'
                    "
                  >
                    <v-btn
                      v-if="message.attachment.attachable_type == 'Album'"
                      to="/albums#pending"
                      >View & Release</v-btn
                    >
                    <v-btn
                      v-else-if="
                        message.attachment.attachable_type == 'ShopProduct'
                      "
                      to="/sell#pendings"
                      >View & Release</v-btn
                    >
                  </div>
                  <div v-else>
                    <v-btn
                      v-if="message.attachment.attachable_type == 'Album'"
                      to="/albums#pending"
                      >View Pending Collaboration</v-btn
                    >
                    <v-btn
                      v-else-if="
                        message.attachment.attachable_type == 'ShopProduct'
                      "
                      to="/sell#pendings"
                      >View Pending Collaboration</v-btn
                    >
                  </div>
                  <!-- <div v-else>
                    <v-btn class="btn--accept" @click.native="acceptCollaboration(message)">Accept</v-btn>
                    <v-btn class="btn--deny" @click.native="denyCollaboration(message)">Deny</v-btn>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </template>

        <template
          v-else-if="message.attachment.attachment_type == 'label_user'"
        >
          <div class="message-content text request no-top-corner">
            <div>
              <div class="content-section">
                <div class="label-message-section">
                  <div class="label-message">{{ message.body }}</div>
                </div>

                <template v-if="message.attachment.attachable_type == 'User'">
                  <div
                    class="repost-item-image avatar"
                    :style="{
                      'background-image':
                        'url(' +
                        message.attachment.assoc.avatar.thumb.url +
                        ')',
                    }"
                  ></div>
                  <div class="info-section">
                    <label class="item-title">{{
                      message.attachment.assoc.display_name
                    }}</label>
                  </div>
                </template>

                <div class="repost-status-section label">
                  <div
                    v-if="
                      message.sender.id == currentUser.id ||
                      message.attachment.status != 'pending'
                    "
                  >
                    <span :class="message.attachment.status">{{
                      message.attachment.status
                    }}</span>
                  </div>
                  <div v-else>
                    <v-btn
                      class="btn--accept"
                      @click.native="acceptLabelUser(message)"
                      >Accept</v-btn
                    >
                    <v-btn
                      class="btn--deny"
                      @click.native="denyLabelUser(message)"
                      >Deny</v-btn
                    >
                  </div>
                </div>
              </div>
            </div>
            <label class="text-message" v-if="false"></label>
          </div>
        </template>

        <template
          v-else-if="message.attachment.attachment_type == 'label_album'"
        >
          <div class="message-content text request no-top-corner">
            <div>
              <div class="content-section">
                <div class="label-message-section">
                  <div class="label-message">{{ message.body }}</div>
                </div>

                <template v-if="message.attachment.attachable_type == 'Album'">
                  <div
                    class="repost-item-image avatar"
                    :style="{
                      'background-image':
                        'url(' + message.attachment.assoc.cover.url + ')',
                    }"
                  ></div>
                  <div class="info-section">
                    <label class="item-title">{{
                      message.attachment.assoc.name
                    }}</label>
                  </div>
                </template>

                <div class="repost-status-section label">
                  <div
                    v-if="
                      message.sender.id == currentUser.id ||
                      message.attachment.status != 'pending'
                    "
                  >
                    <span :class="message.attachment.status">{{
                      message.attachment.status
                    }}</span>
                  </div>
                  <div v-else>
                    <v-btn
                      class="btn--accept"
                      @click.native="acceptLabelAlbum(message)"
                      >Accept</v-btn
                    >
                    <v-btn
                      class="btn--deny"
                      @click.native="denyLabelAlbum(message)"
                      >Deny</v-btn
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template
          v-else-if="message.attachment.attachment_type == 'sample_album'"
        >
          <div class="message-content text request no-top-corner">
            <div>
              <div
                class="content-section"
                v-if="message.attachment.attachable_type == 'Album'"
              >
                <div class="repost-item-image">
                  <activity-album-card
                    :object="message.attachment.assoc"
                  ></activity-album-card>
                </div>
                <div class="info-section">
                  <label class="item-title">{{
                    message.attachment.assoc.name
                  }}</label>
                  <a class="item-user">{{ message.sender.display_name }}</a>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="clear"></div>
      </div>
    </template>
    <template v-else>
      <div class="message-section">
        <router-link :to="`/${message.sender.slug}`">
          <div
            class="user-avatar-image"
            :style="{
              'background-image':
                'url(' + message.sender.avatar.thumb.url + ')',
            }"
          ></div>
        </router-link>
        <div class="message-content text">
          <label class="text-message" v-html="message.body"></label>
        </div>
        <div class="clear"></div>
      </div>
    </template>
  </div>
</template>

<script>
import AlbumService from '@/services/album'
import MessageService from '@/services/message'
import UserService from '@/services/user'
import { Utils } from '@/helper'
import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'

export default {
  components: {
    activityAlbumCard,
    activityProductCard,
  },

  props: ['message', 'isOwn'],

  data() {
    return {}
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    toLocalTimeString() {
      return Utils.toLocalTimeString
    },
  },

  methods: {
    removeRepostRequest(message) {
      MessageService.removeRepost(message.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Removed a repost request!',
          ])
          this.$emit('updated')
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    acceptRepostRequest(message) {
      MessageService.acceptRepost(message.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Accepted a repost request!',
          ])
          this.$emit('updated')
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    denyRepostRequest(message) {
      MessageService.denyRepost(message.id)
        .then((response) => {
          this.$store.dispatch('error/showErrorToast', [
            'Denied a repost request!',
          ])
          this.$emit('updated')
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    acceptRepostRequestOnFree(message) {
      MessageService.acceptRepostOnFree(message.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Accepted a repost request on free!',
          ])
          this.$emit('updated')
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    // viewPendingCollaboration (message) {
    //   if (message.attachment.attachable_type == 'Album') {
    //     this.$store.dispatch('navigator/setCurrentState', {page: 'messages', tab: '', action: 'view_pending_collaboration'})
    //     this.$router.push({ path: '/albums' })
    //   } else if (message.attachment.attachable_type == 'ShopProduct') {
    //     this.$store.dispatch('navigator/setCurrentState', {page: 'messages', tab: '', action: 'view_pending_collaboration'})
    //     this.$router.push({ path: '/sell' })
    //   }
    // },

    // acceptCollaboration (message) {
    //   if (message.attachment.attachable_type == 'Album') {
    //     AlbumService.acceptCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   } else if (message.attachment.attachable_type == 'ShopProduct') {
    //     ProductService.acceptCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   }
    // },

    // denyCollaboration (message) {
    //   if (message.attachment.attachable_type == 'Album') {
    //     AlbumService.denyCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   } else if (message.attachment.attachable_type == 'ShopProduct') {
    //     ProductService.denyCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   }
    // },

    acceptLabelUser(message) {
      UserService.acceptLabelRequest(message.sender.id)
    },

    denyLabelUser(message) {
      UserService.denyLabelRequest(message.sender.id)
    },

    acceptLabelAlbum(message) {
      const params = {
        label_id: message.sender.id,
      }
      AlbumService.acceptLabelRequest(message.attachment.assoc.id, params)
    },

    denyLabelAlbum(message) {
      const params = {
        label_id: message.sender.id,
      }
      AlbumService.denyLabelRequest(message.attachment.assoc.id, params)
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  padding: 3.75px 15px 0px;
  .messaged-time {
    text-align: center;
    font-size: 13.5px;
    color: #9f9f9f;
    letter-spacing: 0;
    margin-bottom: 17.5px;
  }
  .message-section {
    .user-avatar-image {
      width: 60px;
      height: 60px;
      display: inline-block;
      overflow: hidden;
      background-size: cover;
      border-radius: 100%;
      vertical-align: bottom;
      .activity-item-profile-cover {
        margin-left: -11.25px;
        // top: 20.25px;
      }
    }
    .message-content {
      border-radius: 22.5px;
      display: inline-block;
      padding: 7.5px 18.75px;
      max-width: calc(100% - 82.5px);
      &.text {
        .text-message {
          width: 100%;
          word-break: break-word;
          white-space: pre-line;
          font-size: 16px;
          letter-spacing: -0.5px;
          font-family: 'Work Sans';
        }
      }
      &.request {
        padding: 11.25px 18.75px 22.5px;
        width: 420px;
        .repost-status-section {
          .icon-close {
            display: none;
          }
          .status-title {
            font-size: 15px;
            margin-right: 3px;
            letter-spacing: -0.6px;
          }
          span {
            &.accepted {
              color: #14c45b !important;
            }
            &.denied {
              color: #e53935 !important;
            }
            &.pending {
              color: #3a92ff !important;
            }
          }
          .btn {
            // text-transform: none;
            text-transform: capitalize;
            box-shadow: none;
            border-radius: 75px;
            font-size: 16px;
            letter-spacing: -0.6px;
            margin-right: 0;
            margin-left: 0;
            height: 36px;
            min-width: 60px;
            color: #ffffff;
            background-color: #3a92ff;
            &--accept {
              background: #14c45b !important;
            }
            &--deny {
              background: #e53935 !important;
            }
            &--free {
              background: #3a92ff !important;
            }
          }
          &.label {
            margin-top: 20px;
            padding-top: 15px;
          }
        }
        .content-section {
          .label-message-section {
            margin-bottom: 10px;
            padding-bottom: 15px;
            .label-message {
              max-width: 400px;
              font-size: 16px;
              margin-right: 3px;
              letter-spacing: -0.6px;
              font-family: 'Work Sans';
            }
          }
          .repost-item-image {
            width: 100px;
            height: 100px;
            border-radius: 3.75px;
            display: inline-block;
            vertical-align: middle;
            background-size: cover;
            background-position: center;
            overflow: hidden;
            .play-btn {
              width: 37.5px;
              height: 37.5px;
              min-width: 37.5px;
              background: transparent !important;
              box-shadow: none;
              color: rgba(0, 0, 0, 0.5);
              border-radius: 100%;
              margin: 11.25px;
              img {
                width: 37.5px;
                height: 37.5px;
              }
            }
            &.avatar {
              border-radius: 30px;
            }
          }
          .info-section {
            display: inline-block;
            vertical-align: middle;
            padding-left: 7.5px;
            max-width: calc(100% - 67.5px);
            width: 200px;
            .item-title {
              display: block;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-weight: 700;
              font-size: 15px;
              letter-spacing: -0.8px;
              font-family: 'Work Sans';
            }
            .item-user {
              display: block;
              opacity: 0.5;
              font-size: 15px;
              letter-spacing: -0.6px;
            }
          }
          .artist-list {
            padding-top: 20px;
            margin-top: 10px;

            .artist {
              font-size: 15px;
              letter-spacing: -0.6px;

              span:last-child {
                float: right;
              }
            }
          }
        }
      }
    }
  }

  .message-section + .message-section {
    margin-top: 10px;
    padding-bottom: 24px;
  }
}

.message.self {
  .message-section {
    // text-align: right;

    .user-avatar-image {
      float: right;
    }

    .message-content {
      position: relative;
      float: right;
      text-align: left;
      background: #f1f1f1;
      margin-right: 5px;

      &.no-top-corner {
        border-top-right-radius: 7.5px;
      }
      &.no-bottom-corner {
        border-bottom-right-radius: 7.5px;
      }
      &.text {
        .text-message {
          color: #000;
        }
      }
      &.request {
        .repost-status-section {
          .icon-close {
            display: block;
            position: absolute;
            top: -5px;
            right: -5px;
            height: 20px;
            width: 20px;
            line-height: 20px;
            border-radius: 50%;
            background-color: #f44336;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
          }
          .status-title {
            color: #000;
          }
          .btn {
            color: #fff;
            border: 0px solid #fff;
          }
          &.label {
            border-top: 1px dotted #cecece;
          }
        }
        .content-section {
          .label-message-section {
            border-bottom: 1px dotted #cecece;
            .label-message {
              color: #000;
            }
          }
          .repost-item-image {
            .play-btn {
            }
          }
          .info-section {
            .item-title {
              color: #000;
            }
            .item-user {
              color: #000;
            }
          }
          .artist-list {
            border-top: 1px dotted #cecece;
            color: #000000;
          }
        }
      }
    }
  }
}

.message.other {
  .message-section {
    .user-avatar-image {
      float: left;
    }

    .message-content {
      float: left;
      background: #f1f1f1;
      margin-left: 5px;

      &.no-top-corner {
        border-top-left-radius: 7.5px;
      }
      &.no-bottom-corner {
        border-bottom-left-radius: 7.5px;
      }
      &.text {
        .text-message {
          color: #000000;
        }
      }
      &.request {
        .repost-status-section {
          .status-title {
            color: #000000;
          }
          .btn {
            color: #ffffff;
            border: 0px solid #ffffff;
          }
          &.label {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 0.75px solid rgba(0, 0, 0, 0.3);
          }
        }
        .content-section {
          .label-message-section {
            border-bottom: 0.75px solid rgba(0, 0, 0, 0.3);
          }
          .repost-item-image {
            .play-btn {
            }
          }
          .info-section {
            .item-title {
              color: #000000;
            }
            .item-user {
              color: #000000;
            }
          }
          .artist-list {
            border-top: 0.75px solid rgba(0, 0, 0, 0.3);
            color: #000000;
          }
        }
      }
    }
  }
}

.message.space {
  margin-top: 22.5px;
}
</style>
