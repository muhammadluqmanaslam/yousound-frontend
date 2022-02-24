<template>
  <div class="activity-item">
    <div class="activity-item-body">
      <v-layout row wrap>
        <v-flex
          xs12
          md12
          :class="{
            md5: activityItem.sender.recent_reposts,
            'no-reposts': !activityItem.sender.recent_reposts,
          }"
          class="activity-item-section"
        >
          <div class="activity-item-section-body">
            <v-flex xs10 class="activity-item-content-area">
              <profile-item
                :user="activityItem.sender"
                :className="'activity-item-profile-avatar-area'"
              ></profile-item>
              <div class="activity-item-content">
                <div
                  :class="{
                    'd-block': onMobile,
                    'dflex align-center': !onMobile,
                  }"
                >
                  <user-tag class="user-name" :user="activityItem.sender" />
                  <span v-if="!onMobile" class="mx-2">●</span>
                  <span class="activity-time">{{
                    toLocalTimeString(activityItem.updated_at)
                      | formatDateFromNow
                  }}</span>
                </div>
                <!-- <v-btn
                :class="{
                  'follow-btn': true,
                  follow: !activityItem.sender.is_following,
                  following: activityItem.sender.is_following,
                }"
                @click.native="followUser()"
                @mouseenter="buttonHover = true"
                @mouseleave="buttonHover = false"
                >{{ followButtonText }}</v-btn
              > -->

                <label class="description-text align-center">
                  <!-- <img
                    v-if="activityIcon"
                    :src="activityIcon"
                    width="10"
                    class="mr-2"
                  /> -->
                  <v-icon
                    v-if="activityIcon"
                    class="activityIcon mr-2"
                  >
                    {{ activityIcon }}
                  </v-icon>
                  <span>{{ activityItem.message | capitalize }}</span>

                  <!-- <img
                    v-if="activityItem.action_type == 'follow'"
                    src=""
                    class="follow-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'download'"
                    src="/static/images/ic_download.png"
                    class="download-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'play'"
                    src=""
                    class="play-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'comment'"
                    src="/static/images/ic_message.png"
                    class="comment-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'release'"
                    src=""
                    class="release-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'repost'"
                    src="/static/images/ic_repeat.png"
                    class="repost-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'share'"
                    src="/static/images/ic_share.png"
                    class="share-icon"
                  />
                  <v-icon
                    v-else-if="activityItem.action_type == 'recommend'"
                    class="recommend-icon"
                    >thumb_up</v-icon
                  >
                  <span
                    v-if="
                      activityItem.assoc && activityItem.assoc_type != 'Comment'
                    "
                    @click="doAction()"
                    class="items-title"
                    >{{ activityItem.assoc.name }}</span
                  >
                  <span
                    v-if="activityItem.assoc && activityItem.assoc.commentable"
                    @click="doAction()"
                    class="items-title"
                  >
                    <template
                      v-if="activityItem.assoc.commentable_type == 'Post'"
                      >Story</template
                    >
                    <template v-else>{{
                      activityItem.assoc.commentable.name
                    }}</template>
                  </span> -->
                </label>
              </div>
            </v-flex>

            <!-- <v-flex>
              {{ activityItem.assoc.album_type }}
            </v-flex> -->

            <v-flex
              xs2
              v-if="activityItem.action_type == 'comment' || activityItem.assoc"
              class="details"
            >
              <!-- <p v-if="activityItem.action_type == 'comment'">
                <template v-if="activityItem.assoc_type == 'Comment'">
                  {{ activityItem.assoc.body }}
                </template>

                <template v-else-if="activityItem.album_type == 'Post'">
                  {{ activityItem.assoc.description }}
                </template>
              </p> -->

              <template v-if="activityItem.assoc">
                <template v-if="activityItem.assoc_type == 'Comment'">
                  <div
                    v-if="activityItem.assoc.commentable_type == 'ShopProduct'"
                    :style="{
                      'background-image':
                        'url(' +
                        activityItem.assoc.commentable.covers[0].cover.thumb
                          .url +
                        ')',
                    }"
                    class="actioned-item"
                  ></div>
                  <div
                    v-else-if="activityItem.assoc.commentable_type == 'Album'"
                    :style="{
                      'background-image':
                        'url(' +
                        activityItem.assoc.commentable.cover.thumb.url +
                        ')',
                    }"
                    class="actioned-item"
                  ></div>
                  <div
                    v-else-if="activityItem.assoc.commentable_type == 'Post'"
                    :style="{
                      'background-image':
                        'url(' +
                        activityItem.assoc.commentable.cover.thumb.url +
                        ')',
                    }"
                    class="actioned-item"
                  ></div>
                </template>

                <div
                  v-if="activityItem.assoc_type == 'Post'"
                  :style="{
                    'background-image':
                      'url(' + activityItem.assoc.cover.thumb.url + ')',
                  }"
                  class="actioned-item"
                ></div>

                <div
                  class="actioned-item"
                  v-if="activityItem.assoc_type == 'ShopProduct'"
                >
                  <activity-product-card :object="activityItem.assoc" />
                </div>

                <div
                  class="actioned-item"
                  v-if="activityItem.assoc_type == 'Album'"
                >
                  <activity-album-card :object="activityItem.assoc" />
                </div>

                <div
                  class="actioned-item __video"
                  v-if="activityItem.assoc_type == 'Video'"
                >
                  <video-box :hoverOverlay="false" coverOnly :item="testVid" />
                </div>
              </template>
            </v-flex>
          </div>
        </v-flex>

        <!-- <v-flex
          v-if="activityItem.sender.recent_items"
          xs12
          md7
          class="activity-item-recent-posts"
        >
          <div class="recent-posts-section-title">Recent activity</div>
          <div
            v-for="(repost, index) in activityItem.sender.recent_items"
            v-if="['ShopProduct', 'Album'].indexOf(repost.assoc_type) > -1"
            :key="index"
            class="recent-post-item"
          >
            <activity-product-card
              :object="repost"
              v-if="repost.assoc_type == 'ShopProduct'"
            ></activity-product-card>
            <activity-album-card
              :object="repost"
              v-if="repost.assoc_type == 'Album'"
            ></activity-album-card>
          </div>
        </v-flex> -->
      </v-layout>
    </div>

    <!-- <send-message
      v-if="showSendMessage"
      :receiver="activityItem.sender"
      :dismiss="dismissMessageModal"
    /> -->

    <merch-modal
      v-if="showMerchModal && activityItem.assoc_type === 'ShopProduct'"
      :item="activityItem.assoc"
      :dismiss="dimissMerchModal"
    />
  </div>
</template>

<script type="text/javascript">
import { Utils } from "@/helper";
import profileItem from "@/components/profileitem";
import merchModal from "@/components/merchmodal";
import activityAlbumCard from "@/components/activityalbumcard";
import activityProductCard from "@/components/activityproductcard";
import videoBox from "@/components/video_box";
import userTag from "./user_tag";

export default {
  components: {
    profileItem,
    merchModal,
    activityAlbumCard,
    activityProductCard,
    videoBox,
    userTag,
  },

  props: {
    activityItem: {
      type: Object,
    },
  },

  data() {
    return {
      showSendMessage: false,
      showMerchModal: false,
    };
  },

  computed: {
    testVid() {
      return {
        id: 65,
        name: "Ruckazoid - Don’t Let Me Go",
        slug: "ruckazoid-don-t-let-me-go",
        description:
          "An experimental, surreal journey depicting the need of lifeforms to make contact, while showing the fear of providing oneself as a target at the same time.",
        cover: {
          url: "https://d19mruzykfu6hg.cloudfront.net/uploads/stream/cover/65/22d48ff9-a2de-4ad9-866d-cd4c568cbd2c.png",
          large: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/stream/cover/65/large_22d48ff9-a2de-4ad9-866d-cd4c568cbd2c.png",
          },
          thumb: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/stream/cover/65/thumb_22d48ff9-a2de-4ad9-866d-cd4c568cbd2c.png",
          },
        },
        video_type: "uploaded",
        status: "archived",
        started_at: null,
        stopped_at: null,
        mp_channel_1_ep_1_url:
          "https://stream.mux.com/xK02Gq202joat9j5hl4HM00XWyqFDT4EuvA5KcbZp0236YA.m3u8",
        mp_channel_2_url:
          "https://storage.googleapis.com/video-storage-us-east1-uploads/6eYhrvZ62IwreFQBeT34ID6ygEVzEGslAU1wOwp4KWg?Expires=1634950949&GoogleAccessId=direct-uploads-writer-prod%40mux-cloud.iam.gserviceaccount.com&Signature=S01ZU52XWg%2BXKPGz1h9MnBlO8rttVaBn%2FS8CkNngbV%2Bak8Oflc%2FILxYf0Ej51gKXF6kWbHrvADT%2FyCWv2YZg1fjsZA7KOGzIQE%2FL9fRT%2FhwymdC5rasgC8cslGOQV9Q8Gbf4A33nJ1gg2MKqKr7mTEt%2FwRQk%2BPSz5BqBCYojdnq6ESe9gOgjt%2FTM6Ko05gY6ZU3NmcRDr60dHb2vQZTGMzEcmVJ18kr8KU87WqiSSQG%2BxteeQ%2Bh08Orea2S7BRJTeIdLcmCFlpfUlVACschyTCg3r%2BLCc9Jspm%2FadOvXFgGLSKlDYt9WzB1ZxOuAM6OciIsmPUmjIrNmoKuokrE7AA%3D%3D&upload_id=ADPycdtD7NNVYT1xaJQOvj1trbvkyNMzGuaMkKoIUfM2hm9HaxHwKvpRSQgL_5R8ZO7vsF79qkJBMEa6ELpZ1cbOW2c",
        duration: 100,
        valid_period: 0,
        remaining_seconds: -1,
        assoc_type: "ShopProduct",
        account_ids: [],
        digital_content_name: null,
        view_price: 0,
        viewers_limit: 0,
        notified: true,
        assoc: {
          id: 9,
          name: "Action Bronson 7000 Vinyl",
          description:
            'LISTENING TO BLUE CHIPS 7000, THE THIRD INSTALLMENT IN ACTION BRONSON\'S BLUE CHIPS SERIES ("the 7000 is just because it\'s beyond. it\'s not part three, it\'s part 7000."), is just like watching the larger-than-life rapper do his thing on TV. As he spits out brilliant stream-of-consciousness bars filled with humor, knowledge, braggadocio, and self-awareness ("you can never score a point against my defense / for many years, my mind been going off the deep end / uh, like Tom Hanks with the soccer ball / you get turned into a taco / uh, they thought Body was Bruce Willis in Morocco."), you immediately get sucked into his engaging personality & beautiful, Queens-bred mind. Whether he is weaving in obscure pop-culture references or bragging about his expensive/goon-ish lifestyle ("and that\'s my life, 60k for the glass pipe/I\'ll break it on your head if you don\'t act right), he commands the listeners\' full attention, and the funky, rare-grooves-based beats, produced by Alchemist, Harry Fraud, Knxwledge, Daringer, and Party Supplies, are the perfect accompaniments to Action\'s accessible genius. Check out "Let Me Breathe," "9-24-7000," "The Chairman\'s Intent," and "La Luna," and we\'ll go ahead and say it… Big Body Bes needs to do a full album!',
          price: 1998,
          reposted: 1,
          stock: 544,
          sold: 0,
          stock_status: "active",
          collaborators_count: 0,
          show_status: "show_all",
          tax_percent: "0.0",
          is_vat: false,
          seller_location: null,
          status: "published",
          created_at: "2018-02-11T01:32:17.780Z",
          collaborators: [],
          creator_share: 100,
          creator_recoup_cost: 0,
          digital_content_name: null,
          merchant: {
            id: 26,
            slug: "testartist1",
            username: "testartist1",
            display_name: "Hudson Mohawke",
            first_name: null,
            last_name: null,
            contact_url: null,
            user_type: "listener",
            avatar: {
              url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/26/e296aa7c-5107-47a1-8eea-e9813097ed37.jpg",
              thumb: {
                url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/26/thumb_e296aa7c-5107-47a1-8eea-e9813097ed37.jpg",
              },
            },
            repost_price: 100,
            repost_price_end_at: null,
            max_repost_price: 100,
            status: "active",
            size_chart: "",
            shipping_policy: "",
            return_policy: "",
            privacy_policy: "",
            followers: 2,
            followings: 2,
            stripe_connected: false,
            is_following: true,
            invited_at: null,
            request_role: null,
            request_status: null,
          },
          category: {
            id: 6,
            name: "Vinyl",
            description: null,
            is_digital: false,
          },
          variants: [
            {
              id: 3,
              name: "Black Vinyl",
              price: 1998,
              quantity: 544,
            },
          ],
          shipments: [
            {
              id: 9,
              country: "United States",
              shipment_alone_price: 1000,
              shipment_with_price: 500,
            },
          ],
          covers: [
            {
              id: 8,
              cover: {
                url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/8/a21e6a20-63f6-4aac-b09a-39539bb75b27.jpg",
                large: {
                  url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/8/large_a21e6a20-63f6-4aac-b09a-39539bb75b27.jpg",
                },
                thumb: {
                  url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/8/thumb_a21e6a20-63f6-4aac-b09a-39539bb75b27.jpg",
                },
              },
              position: 0,
            },
            {
              id: 9,
              cover: {
                url: null,
                large: {
                  url: null,
                },
                thumb: {
                  url: null,
                },
              },
              position: 1,
            },
            {
              id: 10,
              cover: {
                url: null,
                large: {
                  url: null,
                },
                thumb: {
                  url: null,
                },
              },
              position: 2,
            },
          ],
        },
        guests: [],
        ml_input_id: null,
        ml_input_dest_1_url: "rtmp://live.yousound.com:5222/app",
        is_reposted: false,
        broadcast_seconds: 0,
        digital_content_url: null,
        accounts: [],
        user: {
          id: 46,
          slug: "ruckazoid",
          username: "ruckazoid",
          display_name: "RUCKAZOID",
          first_name: null,
          last_name: null,
          contact_url: "",
          user_type: "artist",
          avatar: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
            thumb: {
              url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
            },
          },
          repost_price: 100,
          repost_price_end_at: null,
          max_repost_price: 100,
          status: "active",
          size_chart: "Standard US sizing",
          shipping_policy: "All orders shipped VIA USPS same day before 2pm.",
          return_policy: "No returns dog, don't waste my time!",
          privacy_policy: "",
          followers: 13,
          followings: 10,
          enable_alert: true,
          balance_amount: 913785,
          available_amount: 913785,
          stripe_connected: true,
          sign_in_count: 950,
          stream_rolled_time: 0,
          stream_rolled_cost: 0,
          data: {
            discover_page_visited: 1,
            video_page_visited: 1,
            message_page_visited: 1,
            sell_page_visited: 1,
            stream_page_visited: 1,
          },
          is_following: false,
          invited_at: null,
          request_role: "artist",
          request_status: "accepted",
        },
        genre: {
          id: 276,
          slug: "r-b-soul",
          name: "R&B / SOUL",
          region: "",
          color: "#67ACD0",
          sequence: 15,
          users_size: 0,
        },
      };
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    toLocalTimeString() {
      return Utils.toLocalTimeString;
    },

    actionText() {
      if (this.activityItem.action_type === "release") {
        return "released";
      } else if (this.activityItem.action_type === "repost") {
        return "reposted";
      } else if (this.activityItem.action_type === "unrepost") {
        return "unreposted";
      } else if (this.activityItem.action_type === "follow") {
        return "followed you";
      } else if (this.activityItem.action_type === "unfollow") {
        return "unfollowed you";
      } else if (this.activityItem.action_type === "play") {
        return "played";
      } else if (this.activityItem.action_type === "download") {
        return "downloaded";
      } else {
        return "commented";
      }
    },
    activityIcon() {
      switch (this.activityItem.action_type) {
        case "repost":
          // return require("../../static/images/repost_blue.svg");
          return 'repeat'
        case "comment":
          // return require("../../static/images/comment.svg");
          return 'comment'
        case "order_product":
          // return require("../../static/images/dollar.svg");
          return 'paid'
        case "donation":
          // return require("../../static/images/dollar.svg");
          return 'paid'
        default:
          return null;
      }
    },

    followButtonText() {
      if (this.activityItem.sender.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },
  },

  created() {},

  methods: {
    showMessageDialog() {
      this.showSendMessage = true;
    },

    dismissMessageModal() {
      this.showSendMessage = false;
    },

    imageURL(item) {
      if (item.cover) {
        return item.cover.thumb.url;
      } else {
        return item.covers[0].cover.thumb.url;
      }
    },

    blockUser() {},

    doAction() {
      switch (this.activityItem.assoc_type) {
        case "ShopProduct":
          this.showMerchModal = !true;
          break;
        case "Album":
          this.$router.push({
            path:
              this.activityItem.assoc.album_type +
              "/" +
              this.activityItem.assoc.slug,
          });
          break;
        default:
          if (this.activityItem.assoc.commentable_type === "Album") {
            this.$router.push({
              path:
                this.activityItem.assoc.commentable.album_type +
                "/" +
                this.activityItem.assoc.commentable.slug,
            });
          }
      }
    },

    dimissMerchModal() {
      this.showMerchModal = false;
    },
  },
};
</script>
<style src="../../static/styles/activityitem.scss" lang="scss" scoped></style>
