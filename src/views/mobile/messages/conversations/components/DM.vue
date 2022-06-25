<template>
  <transition name="slide-up">
    <div v-if="messages.length" class="DM_active dm-page">
      <div class="dm-content">
        <div class="top-section">
          <v-icon @click="closeDM" class="action-icon">more_horiz</v-icon>
          <div class="other-user">
            <user-tag
              :user="conv.other"
              width="32"
              height="32"
              showAvatar
              hideName
              hideTick
            />
            <user-tag :user="conv.other" />
          </div>
          <v-icon @click="closeDM" class="action-icon"
            >keyboard_arrow_down</v-icon
          >
        </div>

        <div class="body-section">
            <message
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :is-own="conv.other.id != message.sender.id"
              @updated="refreshMessages"
            />
        </div>

        <div class="input-section">
            <img :src="require('@/assets/dm_donate_icon.svg')" class="donate_icon" alt="donate icon" />
            <img :src="require('@/assets/dm_repost_icon.svg')" class="repost_icon" alt="donate icon" />
            <input type="text" placeholder="Add your reply">
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from "lodash";
import MessageService from "@/services/message";
import userTag from "@/components/user_tag";
import message from "./message";

export default {
  props: {
    conv: {
      type: Object,
      required: true,
    },
  },
  components: {
    userTag,
    message,
  },
  data() {
    return {
    //   conv: {},
      messages: [],
    };
  },
  methods: {
    closeDM() {
      console.log("emit");
      this.$emit("closeDM");
    },
    loadConversation(id, loadMore, scrollMove) {
      if (scrollMove) {
        this.$store.dispatch("error/showLoadingActivity", true);
      }
      const params = {
        conversation_id: id,
      };
      MessageService.getMessages(params)
        .then((response) => {
          if (loadMore) {
            // this.messages = this.conversation.concat(response.body.messages)
            this.messages = _.reverse(response.body.messages).concat(
              this.messages
            );
          } else {
            // this.conversation = response.body
            this.messages = _.reverse(response.body.messages);

            if (scrollMove) {
              this.$nextTick(() => {
                // $(".message-list-section").animate({ scrollTop: $(".message-list-section").prop("scrollHeight")}, 1000);
                $(".message-list-section").scrollTop(
                  $(".message-list-section").prop("scrollHeight")
                );
              });
            }
          }
          // this.$forceUpdate()
          this.$store.dispatch("error/showLoadingActivity", false);
        })
        .catch((e) => {
          // console.log(e)
          // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          this.$store.dispatch("error/showLoadingActivity", false);
        });
    },
    refreshMessages() {
      if (this.conv && this.conv.id !== undefined) {
        this.loadMessages(this.conv.id, false, false);
      }
    },
    selectedConversation(conv) {
      if (this.conversation.id === conv.id) {
        return;
      }

      this.item = null;
      this.conversation = conv;
      this.conversation.last_message.is_read = true;
      this.loadConversation(this.conversation.id, false, true);
    },
  },
  created() {
    // this.conv = {
    //   id: 8,
    //   created_at: "2018-02-13T02:21:12.351Z",
    //   other: {
    //     id: 24,
    //     slug: "stuntgodtest",
    //     username: "stuntgodtest",
    //     display_name: "STUNT",
    //     first_name: null,
    //     last_name: null,
    //     contact_url: null,
    //     user_type: "brand",
    //     avatar: {
    //       url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //       thumb: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/thumb_9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //       },
    //     },
    //     repost_price: 100,
    //     repost_price_end_at: null,
    //     max_repost_price: 100,
    //     status: "deleted",
    //     size_chart: "",
    //     shipping_policy: "",
    //     return_policy: "",
    //     privacy_policy: "",
    //     followers: 4,
    //     followings: 3,
    //     stripe_connected: false,
    //     stream: null,
    //     is_following: true,
    //     invited_at: null,
    //     request_role: "brand",
    //     request_status: "accepted",
    //     hidden_genres: [],
    //     blocked_users: [],
    //     favorite_users: [],
    //     default_address: null,
    //     inviter: null,
    //   },
    //   last_message: {
    //     id: 120,
    //     body: "😎",
    //     created_at: "2018-03-05T19:18:34.229Z",
    //     is_read: true,
    //     sender: {
    //       id: 46,
    //       slug: "ruckazoid",
    //       username: "ruckazoid",
    //       display_name: "RUCKAZOID",
    //       user_type: "artist",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         },
    //       },
    //       status: "active",
    //       stripe_connected: true,
    //     },
    //     attachment: null,
    //   },
    // };
    console.log("CONV: ", this.conv);
    this.loadConversation(this.conv.id, false, true);
    console.log();

    // this.messages = [
    //   {
    //     id: 120,
    //     body: "😎",
    //     created_at: "2018-03-05T19:18:34.229Z",
    //     is_read: true,
    //     sender: {
    //       id: 46,
    //       slug: "ruckazoid",
    //       username: "ruckazoid",
    //       display_name: "RUCKAZOID",
    //       user_type: "artist",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         },
    //       },
    //       status: "active",
    //       stripe_connected: true,
    //     },
    //     attachment: null,
    //   },
    //   {
    //     id: 119,
    //     body: "Shit 🔥 I got you bro! ",
    //     created_at: "2018-03-05T03:24:05.798Z",
    //     is_read: true,
    //     sender: {
    //       id: 24,
    //       slug: "stuntgodtest",
    //       username: "stuntgodtest",
    //       display_name: "STUNT",
    //       user_type: "brand",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/thumb_9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //         },
    //       },
    //       status: "deleted",
    //       stripe_connected: false,
    //     },
    //     attachment: null,
    //   },
    //   {
    //     id: 109,
    //     body: "108",
    //     created_at: "2018-02-28T18:18:27.343Z",
    //     is_read: true,
    //     sender: {
    //       id: 46,
    //       slug: "ruckazoid",
    //       username: "ruckazoid",
    //       display_name: "RUCKAZOID",
    //       user_type: "artist",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         },
    //       },
    //       status: "active",
    //       stripe_connected: true,
    //     },
    //     attachment: {
    //       id: 18,
    //       attachment_type: "repost",
    //       attachable_type: "Album",
    //       status: "accepted",
    //       assoc: {
    //         id: 47,
    //         slug: "jumpin-like-jordan",
    //         name: "Jumpin Like Jordan",
    //         description:
    //           'Haven\'t added the real 808s yet, it aint slappin, test shhh, reup will be slappin ..    \n\nP.S.  Just added "Release Date" drop down to Trello (cuz this is 2017 shh),',
    //         cover: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/47/1ffe7464-ad13-4ed7-a8b2-cf6ca46bdb5e.png",
    //           large: {
    //             url: "https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/47/large_1ffe7464-ad13-4ed7-a8b2-cf6ca46bdb5e.png",
    //           },
    //           thumb: {
    //             url: "https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/47/thumb_1ffe7464-ad13-4ed7-a8b2-cf6ca46bdb5e.png",
    //           },
    //         },
    //         album_type: "album",
    //         collaborators_count: 0,
    //         status: "deleted",
    //         genres: [
    //           {
    //             id: 2,
    //             slug: "acoustic-blues",
    //             name: "Acoustic Blues",
    //             region: "BLUES",
    //             color: "",
    //             sequence: 0,
    //             users_size: 0,
    //           },
    //         ],
    //         is_only_for_live_stream: false,
    //         is_content_acapella: false,
    //         is_content_instrumental: false,
    //         is_content_stems: false,
    //         is_content_remix: false,
    //         is_content_dj_mix: false,
    //         recommended: false,
    //         played: 4,
    //         downloaded: 1,
    //         reposted: 4,
    //         commented: 5,
    //         enabled_sample: false,
    //         created_at: "2018-02-15T17:56:19.009Z",
    //         released_at: "2018-02-15T17:56:19.462Z",
    //         recommended_at: null,
    //         location: "",
    //         tracks: [
    //           {
    //             id: 255,
    //             slug: "jumpin-like-jordan-mp3--2",
    //             name: "Jumpin Like Jordan.mp3",
    //             audio: {
    //               url: "https://ys-integration.s3.amazonaws.com/uploads/track/audio/255/a50f9bf9-3980-404d-b011-44135f696542.mp3?X-Amz-Expires=86400&X-Amz-Date=20220623T114307Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220623/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=3c033cc929307b4e57f39a4600a760e3d2df541201ce164e16686858a26944a4",
    //             },
    //             status: "active",
    //             downloaded: 0,
    //             played: 0,
    //             audio_download_url:
    //               "https://ys-integration.s3.amazonaws.com/uploads/track/audio/255/a50f9bf9-3980-404d-b011-44135f696542.mp3?response-content-disposition=attachment%3B%20filename%3D%22Jumpin%20Like%20Jordan.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220623T114307Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220623/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=f43ec08611715dd040815c9aecfe17242bcbeaea5ac4522918306d360802bd75",
    //             album: null,
    //             position: 0,
    //           },
    //         ],
    //         user: {
    //           id: 46,
    //           slug: "ruckazoid",
    //           username: "ruckazoid",
    //           display_name: "RUCKAZOID",
    //           first_name: null,
    //           last_name: null,
    //           contact_url: "",
    //           user_type: "artist",
    //           avatar: {
    //             url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //             thumb: {
    //               url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //             },
    //           },
    //           repost_price: 100,
    //           repost_price_end_at: null,
    //           max_repost_price: 100,
    //           status: "active",
    //           size_chart: "Standard US sizing",
    //           shipping_policy:
    //             "All orders shipped VIA USPS same day before 2pm.",
    //           return_policy: "No returns dog, don't waste my time!",
    //           privacy_policy: "",
    //           followers: 14,
    //           followings: 12,
    //           enable_alert: true,
    //           balance_amount: 913785,
    //           available_amount: 913785,
    //           stripe_connected: true,
    //           sign_in_count: 1085,
    //           stream_rolled_time: 0,
    //           stream_rolled_cost: 0,
    //           data: {
    //             discover_page_visited: 1,
    //             video_page_visited: 1,
    //             message_page_visited: 1,
    //             sell_page_visited: 1,
    //             stream_page_visited: 1,
    //           },
    //           is_following: false,
    //           invited_at: null,
    //           request_role: "artist",
    //           request_status: "accepted",
    //           inviter: null,
    //         },
    //       },
    //     },
    //   },
    //   {
    //     id: 108,
    //     body: "yoo repost this dog",
    //     created_at: "2018-02-28T18:18:27.318Z",
    //     is_read: true,
    //     sender: {
    //       id: 46,
    //       slug: "ruckazoid",
    //       username: "ruckazoid",
    //       display_name: "RUCKAZOID",
    //       user_type: "artist",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         },
    //       },
    //       status: "active",
    //       stripe_connected: true,
    //     },
    //     attachment: null,
    //   },
    //   {
    //     id: 90,
    //     body: "where the artwork at, I sent you 5 racks dog",
    //     created_at: "2018-02-24T00:12:06.564Z",
    //     is_read: true,
    //     sender: {
    //       id: 46,
    //       slug: "ruckazoid",
    //       username: "ruckazoid",
    //       display_name: "RUCKAZOID",
    //       user_type: "artist",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //         },
    //       },
    //       status: "active",
    //       stripe_connected: true,
    //     },
    //     attachment: null,
    //   },
    //   {
    //     id: 29,
    //     body: "STUNT wants to upload this product collaboration",
    //     created_at: "2018-02-13T02:21:12.351Z",
    //     is_read: true,
    //     sender: {
    //       id: 24,
    //       slug: "stuntgodtest",
    //       username: "stuntgodtest",
    //       display_name: "STUNT",
    //       user_type: "brand",
    //       avatar: {
    //         url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //         thumb: {
    //           url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/thumb_9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //         },
    //       },
    //       status: "deleted",
    //       stripe_connected: false,
    //     },
    //     attachment: {
    //       id: 5,
    //       attachment_type: "collaboration",
    //       attachable_type: "ShopProduct",
    //       status: "accepted",
    //       assoc: {
    //         id: 38,
    //         name: "STUNT 'The Bay' Strapback",
    //         description:
    //           "All white 6 panel strapback\n\nFeaturing: \n-Embroidery on the front & back\n-Flipped up the eBay logo to thebay",
    //         price: 2500,
    //         reposted: 5,
    //         stock: 0,
    //         sold: 11,
    //         stock_status: "active",
    //         collaborators_count: 1,
    //         show_status: "show_all",
    //         tax_percent: "0.0",
    //         is_vat: false,
    //         seller_location: null,
    //         status: "collaborated",
    //         created_at: "2018-02-13T02:21:11.087Z",
    //         collaborators: [
    //           {
    //             id: 75,
    //             user_id: 46,
    //             product_id: 38,
    //             user_type: "collaborator",
    //             user_share: 5,
    //             status: "accepted",
    //             user: {
    //               id: 46,
    //               slug: "ruckazoid",
    //               username: "ruckazoid",
    //               display_name: "RUCKAZOID",
    //               first_name: null,
    //               last_name: null,
    //               contact_url: "",
    //               user_type: "artist",
    //               avatar: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //                 thumb: {
    //                   url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/46/thumb_4001747e-460d-4fc5-a7c7-c5165bd1a27a.png",
    //                 },
    //               },
    //               repost_price: 100,
    //               repost_price_end_at: null,
    //               max_repost_price: 100,
    //               status: "active",
    //               size_chart: "Standard US sizing",
    //               shipping_policy:
    //                 "All orders shipped VIA USPS same day before 2pm.",
    //               return_policy: "No returns dog, don't waste my time!",
    //               privacy_policy: "",
    //               followers: 14,
    //               followings: 12,
    //               enable_alert: true,
    //               balance_amount: 913785,
    //               available_amount: 913785,
    //               stripe_connected: true,
    //               sign_in_count: 1085,
    //               stream_rolled_time: 0,
    //               stream_rolled_cost: 0,
    //               data: {
    //                 discover_page_visited: 1,
    //                 video_page_visited: 1,
    //                 message_page_visited: 1,
    //                 sell_page_visited: 1,
    //                 stream_page_visited: 1,
    //               },
    //               is_following: false,
    //               invited_at: null,
    //               request_role: "artist",
    //               request_status: "accepted",
    //             },
    //           },
    //         ],
    //         creator_share: 95,
    //         creator_recoup_cost: 0,
    //         digital_content_name: null,
    //         merchant: {
    //           id: 24,
    //           slug: "stuntgodtest",
    //           username: "stuntgodtest",
    //           display_name: "STUNT",
    //           first_name: null,
    //           last_name: null,
    //           contact_url: null,
    //           user_type: "brand",
    //           avatar: {
    //             url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //             thumb: {
    //               url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/24/thumb_9d90070f-b8ed-4e0c-8cb0-9b8153635f10.jpg",
    //             },
    //           },
    //           repost_price: 100,
    //           repost_price_end_at: null,
    //           max_repost_price: 100,
    //           status: "deleted",
    //           size_chart: "",
    //           shipping_policy: "",
    //           return_policy: "",
    //           privacy_policy: "",
    //           followers: 4,
    //           followings: 3,
    //           stripe_connected: false,
    //           is_following: true,
    //           invited_at: null,
    //           request_role: "brand",
    //           request_status: "accepted",
    //         },
    //         category: {
    //           id: 1,
    //           name: "Tee",
    //           description: null,
    //           is_digital: false,
    //         },
    //         variants: [
    //           {
    //             id: 10,
    //             name: "thebay",
    //             price: 2500,
    //             quantity: 0,
    //           },
    //         ],
    //         shipments: [
    //           {
    //             id: 29,
    //             country: "United States",
    //             shipment_alone_price: 500,
    //             shipment_with_price: 700,
    //           },
    //         ],
    //         covers: [
    //           {
    //             id: 80,
    //             cover: {
    //               url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/80/a064bfa5-7a0a-4cb3-8e50-3a205cf1d6c5.jpg",
    //               large: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/80/large_a064bfa5-7a0a-4cb3-8e50-3a205cf1d6c5.jpg",
    //               },
    //               thumb: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/80/thumb_a064bfa5-7a0a-4cb3-8e50-3a205cf1d6c5.jpg",
    //               },
    //             },
    //             position: 0,
    //           },
    //           {
    //             id: 81,
    //             cover: {
    //               url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/81/b1909151-f6a2-43fd-9c18-cadca177e18d.jpg",
    //               large: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/81/large_b1909151-f6a2-43fd-9c18-cadca177e18d.jpg",
    //               },
    //               thumb: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/81/thumb_b1909151-f6a2-43fd-9c18-cadca177e18d.jpg",
    //               },
    //             },
    //             position: 1,
    //           },
    //           {
    //             id: 82,
    //             cover: {
    //               url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/82/792d3008-8615-40f4-8d6e-d723e8e463e3.jpg",
    //               large: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/82/large_792d3008-8615-40f4-8d6e-d723e8e463e3.jpg",
    //               },
    //               thumb: {
    //                 url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/82/thumb_792d3008-8615-40f4-8d6e-d723e8e463e3.jpg",
    //               },
    //             },
    //             position: 2,
    //           },
    //         ],
    //       },
    //     },
    //   },
    // ];

    // console.log({ messages: this.messages });
  },
};
</script>
<style src="../../../../../../static/styles/mobile/DM.scss" lang="scss" scoped></style>
