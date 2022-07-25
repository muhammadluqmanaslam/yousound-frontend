<template>
  <transition name="slide-up">
    <div class="sms-engagement">
      <div class="_top">
        <div class="_title">
          <div>SMS</div>
          <div>Conversation</div>
        </div>
        <v-icon @click="closeEngagement" class="close-icon">
          keyboard_arrow_down
        </v-icon>
      </div>

      <div class="message">
        <div class="message-wrapper">
          <user-tag :user="currentUser" showAvatar hideTick hideName width="43" height="43" />

          <div class="message-content">Hello, test message</div>
        </div>

        <div class="attachment">
          <v-icon class="attach-icon">attachment</v-icon>
          <trackcardsimple
            :item="attachment"
            :cover="''"
            :title="attachment.title"
            :subtitle="attachment.title"
            coverRadius
            :isVideo="attachType  === 'Video'"
          />
        </div>

        <div class="_summary">
          <div class="_detail">
            Delivered to <strong class="recipientsLen">{{ recipientsLen }} contacts via <strong>SMS</strong></strong>
          </div>

          <div class="_time">{{ new Date(Date.now()) | getTime }}</div>
        </div>
      </div>

      <directory :customDirectory="[]" isComp :height="70" separator class="pt-0" />
    </div>
  </transition>
</template>

<script>
import UserTag from "@/components/user_tag";
import Trackcardsimple from "@/components/trackcardsimple";
import Directory from '../../components/contacts/directory.vue';

export default {
  components: { UserTag, Trackcardsimple, Directory },
  data() {
    return {
      attachment: { type: "Video", title: "Test Title", subtitle: "Test Subtitle" },
      recipients: {},
    };
  },
  methods: {
    closeEngagement() {
      this.$emit("closeEngagement");
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    recipientsLen() {
      return 200;
    },
    attachType() {
      switch (this.attachment.type) {
        case "ShopProduct":
          return "ShopProduct";
        case "Album":
          return "Album";
        case "Video":
          return "Video";
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sms-engagement {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  z-index: 99;
  padding: 20px 0;
  width: 100%;
  height: 100%;

  ._top {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 0 20px 20px 20px;
    border-bottom: 1px solid #0000001A;

    ._title {
      flex: 1;
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 1;
    }
    .close-icon {
      color: #00000099;
      font-size: 40px;
    }
  }

  .message {
    padding: 0 20px;

    &-wrapper {
      max-width: 87%;
      display: flex;
      margin-bottom: 13px;
  
      .message-content {
        position: relative;
        text-align: left;
        margin-right: 5px;
        border-radius: 6px;
        padding: 12px 16px;
        background-color: #F1F4F6;
  
        &::before {
          position: absolute;
          width: 0;
          height: 0;
          left: -40px;
          right: auto;
          top: -8px;
          bottom: auto;
          border: 32px solid;
          border-color: transparent;
          border-radius: 100px;
        }
        &::after {
          position: absolute;
          width: 0;
          height: 0;
          left: -13px;
          right: auto;
          top: 0px;
          bottom: auto;
          border: 22px solid;
          border-color: #f2f2f7 transparent transparent transparent;
          border-radius: 0px;
          z-index: -2;
        }
  
        .messaged-time {
          font-weight: 700;
          margin: 6px 0 -5px 0;
          text-align: right;
        }
      }
    }

    .attachment {
      display: flex;
      align-items: center;

      .icon {
        color: #00000080;
        margin-right: 30px;
      }
    }

    ._summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #00000099;
      margin: 10px 0;

      .recipientsLen {
        color: #000000;
      }

      ._time {
        color: #666668CC;
      }
    }
  }

}
</style>
