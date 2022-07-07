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
          <img
            :src="require('@/assets/dm_donate_icon.svg')"
            class="donate_icon"
            alt="donate icon"
            @click="openSendLoveModal()"
          />
          <img
            :src="require('@/assets/dm_repost_icon.svg')"
            class="repost_icon"
            alt="repost icon"
            @click="openRepostModal()"
          />
          <input
            v-model.trim="message.body"
            type="text"
            placeholder="Add your reply"
            @keyup.enter="checkMessage()"
            @focus="toggleInputFocus(true)"
            @blur="toggleInputFocus(false)"
          />
        </div>
      </div>

      <!-- v-if="
        ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1 &&
        otherStripeConnected && toggleAttachSide
      " -->

      <attach-picker
        v-if="toggleShowAttach"
        @getSelected="getSelected"
        title=""
        closeIcon="cancelBtn"
        :customAlbums="albums"
        :customProducts="products"
        :dismiss="closeAttachPicker"
        showVideo
        fullscreen
        altFullscreenHeader
      />

      <repost-payment-modal
        v-if="show_repost_payment_modal"
        :item="attachment.value"
        :itemType="repostTab"
        :receiver="conv.other"
        :dismiss="closeRepostPaymentModal"
        :finish="sendMessage"
      />

      <send-love-modal
        v-if="show_send_love_modal"
        :item="conv.other"
        :dismiss="closeSendLoveModal"
      />

      <v-dialog v-model="show_block_user_confirm_dialog">
        <v-card>
          <v-card-title class="headline">Block a User</v-card-title>
          <v-card-text
            >Are you sure you want to block &lt;{{
              otherName
            }}&gt;?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="blue--text darken-1"
              flat="flat"
              @click.native="blockUser()"
              >Ok</v-btn
            >
            <v-btn
              class="blue--text darken-1"
              flat="flat"
              @click.native="closeBlockUserConfirmDialog()"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="show_conversation_delete_confirm_dialog">
        <v-card>
          <v-card-title class="headline">Delete a Conversation</v-card-title>
          <v-card-text
            >If you click OK, all messages under the conversation will be
            deleted. Click OK to delete a conversation with &lt;{{
              otherName
            }}&gt;, or click Cancel.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="blue--text darken-1"
              flat="flat"
              @click.native="deleteEntireMessage()"
              >Ok</v-btn
            >
            <v-btn
              class="blue--text darken-1"
              flat="flat"
              @click.native="closeConversationDeleteConfirmDialog()"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </transition>
</template>

<script>
import _ from "lodash";
import MessageService from "@/services/message";
import AlbumService from "@/services/album";
import ProductService from "@/services/product";
import Attach from "@/views/video/components/attach";
import userTag from "@/components/user_tag";
import repostPaymentModal from "@/components/repost_payment_modal";
import SendLoveModal from "@/components/sendlovemodal";
import AttachSlide from '@/components/attachSlide'
import message from "./message";
import AttachPicker from "@/views/video/components/attach_picker"

export default {
  props: {
    conv: {
      type: Object,
      required: true,
    },
  },
  components: {
    AttachSlide,
    AttachPicker,
    userTag,
    message,
    repostPaymentModal,
    SendLoveModal,
  },
  data() {
    return {
      toggleShowAttach:  false,
      defaultRepostMessage: "Hi, if you like this please repost it, thank you.",
      repostTab: "Album",
      albums: [],
      products: [],
      attachment: {
        value: "",
        type: "Album",
      },
      message: {
        body: "",
      },
      messages: [],
      show_conversation_delete_confirm_dialog: false,
      show_block_user_confirm_dialog: false,
      show_repost_payment_modal: false,
      show_repost_modal: false,
      show_send_love_modal: false,
    };
  },
  watch: {
    attachment(val) {
      console.log("attachment changed", val);
      if (this.attachment.value === val) {
        this.emptyAttachment();
        if (this.message.body === this.defaultRepostMessage) {
          this.message.body = "";
        }
      } else {
        this.attachment.value = val;
        if (this.message.body === "") {
          this.message.body = this.defaultRepostMessage;
        }
      }
    },
  },
  methods: {
    closeAttachPicker() {
      this.toggleShowAttach = false
    },
    toggleInputFocus(status) {
      this.toggleShowAttach = status
    },
    getSelected(data) {
      console.log("update attachment (getSelected):", data)
      this.attachment = data
      this.toggleShowAttach = false
    },
    loadAlbums() {
      const params = {
        statuses: "published, collaborated",
        user_statuses: "accepted",
      };
      AlbumService.getAlbums(params)
        .then((response) => {
          this.albums = response.body;
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },
    loadProducts() {
      const params = {
        statuses: "published, collaborated",
        stock_statuses: "active",
        user_statuses: "accepted",
      };
      ProductService.getProducts(params)
        .then((response) => {
          this.products = response.body;
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },
    emptyAttachment() {
      this.attachment = {
        value: "",
        type: "",
      };
      this.$refs.assocAttach.removeAttach();
    },
    onRepostTab(tab) {
      this.tab = tab;
    },
    openSendLoveModal() {
      this.show_send_love_modal = true;
    },
    closeSendLoveModal() {
      this.show_send_love_modal = false;
    },
    openRepostPaymentModal() {
      this.show_repost_payment_modal = true;
    },
    closeRepostPaymentModal() {
      this.show_repost_payment_modal = false;
    },
    openRepostModal() {
      this.show_repost_modal = true;

      this.$nextTick(()=> {
        this.$refs.assocAttach.openAttachPicker();
      })
    },
    closeRepostModal() {
      this.show_repost_modal = false;
    },
    // selectItem(attachment) {
    //   if (this.attachment === attachment) {
    //     this.attachment = null
    //     if (this.message.body === this.defaultRepostMessage) {
    //       this.message.body = ""
    //     }
    //   } else {
    //     this.attachment = attachment
    //     if (this.message.body === "") {
    //       this.message.body = this.defaultRepostMessage
    //     }
    //   }
    // },
    checkMessage() {
      if (this.attachment.value) {
        this.openRepostPaymentModal();
      } else {
        this.sendMessage();
      }
    },

    sendMessage(token) {
      this.closeRepostPaymentModal();

      let params = {
        body: this.message.body,
      };
      params["receiver_id"] = this.conv.other.id;
      if (this.attachmen.valuet) {
        if (this.repostTab === "Album") {
          params["attachable_type"] = "Album";
          params["attachable_id"] = this.attachment.value.id;
        } else {
          params["attachable_type"] = "ShopProduct";
          params["attachable_id"] = this.attachment.value.id;
        }
        this.emptyAttachment();
      }
      if (token) {
        params["payment_token"] = token.id;
      }
      MessageService.addMessage(params)
        .then((response) => {
          // this.loadMessages(this.conv.id, false, true)
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        })
        .finally(() => (this.message.body = ""));
    },
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
            // this.messages = this.conv.concat(response.body.messages)
            this.messages = _.reverse(response.body.messages).concat(
              this.messages
            );
          } else {
            // this.conv = response.body
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
      if (this.conv.id === conv.id) {
        return;
      }

      this.emptyAttachment();
      this.conv = conv;
      this.conv.last_message.is_read = true;
      this.loadConversation(this.conv.id, false, true);
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    otherStripeConnected() {
      return _.get(this.conv, "other.stripe_connected", false);
    },
    otherName() {
      return _.get(this.conv, "other.display_name", "");
    },
  },
  created() {
    console.log("CONV: ", this.conv);
    this.loadConversation(this.conv.id, false, true);
    this.loadAlbums();
    this.loadProducts();
  },
};
</script>
<style src="../../../../../../static/styles/mobile/messages.scss" lang="scss" scoped></style>
<style src="../../../../../../static/styles/mobile/DM.scss" lang="scss" scoped></style>
