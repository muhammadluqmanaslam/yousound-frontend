<template>
  <div class="sms-landing">
    <v-container v-if="isUserSubscribed" grid-list-xs fluid pa-0>
      <v-layout>
        <v-flex sm3 conversation-list>
          <div class="_intro">
            <div class="_title app-bold">Sent SMS</div>
            <div class="_subtitle">
              {{ smsCount }} text {{ "message" | pluralize(smsCount) }}
            </div>
          </div>

          <div class="conversation-content">
            <div
              v-for="(message, index) in smsList"
              :key="index"
              class="message"
              @click="openMessage(message.id)"
            >
              <user-tag
                :user="currentUser"
                showAvatar
                hideTick
                hideName
                width="37.7"
                height="37.5"
                :clickUser="false"
              />
              <div>
                <div class="message-recipient">teekomusic</div>
                <div class="message-trunc">
                  {{ message.message }}
                </div>
                <div class="messaged-time">
                  {{ message.created_at | toLocalTimeString }}
                </div>
              </div>
            </div>
          </div>
        </v-flex>

        <v-flex sm9 conversation-card>
          <div class="_intro">
            Send SMS text to <strong>2,343 people</strong> on your sms list
          </div>

          <div class="message-content">
            <transition name="fade">
              <sms-engagement
                :item="currentMessage"
                v-if="smsEngagementActive"
                @closeEngagement="closeEngagement"
              />
            </transition>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container
      v-else
      grid-list-xs
      fluid
      pa-0
      sms-community
      not-subscribed
      allChildrenCenter
    >
      <div class="text-center _wrapper">
        <h1 class="_intro-text">Reach your community through text.</h1>

        <img
          :src="require('@/assets/sms_chat.svg')"
          width="40%"
          class="my-5"
          alt="sms chat"
        />

        <div>
          You have <strong>2,039 people</strong> on your SMS contact list.
          Subscribe to text them!
        </div>

        <v-btn depressed round dark class="mt-3 px-3"> Subscribe </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import smsService from "@/services/sms";
import UserTag from "@/components/user_tag.vue";

export default {
  components: { UserTag },
  data() {
    return {
      smsList: [],
      smsEngagementActive: false,
      currentMessage: {},
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    smsCount() {
      return this.smsList.length;
    },
    isUserSubscribed() {
        return this.currentUser.stripe_subscription_id;
    },
  },
  methods: {
    openMessage(smsId) {
      smsService
        .getSMS(smsId)
        .then((response) => {
          this.currentMessage = response.body;
          this.smsEngagementActive = true;
        })
        .catch((e) => {
          console.log(e);
          console.log(e.response);
          console.log(e.message);
          this.$store.dispatch("error/showErrorToast", [
            "There was an error opening message",
          ]);
        });
    },
    closeEngagement() {
      this.smsEngagementActive = false;
      this.currentMessage = {};
    },
    listAllSMS() {
      smsService
        .listSMS()
        .then((response) => {
          this.smsList = response.body;
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },
  },
  created() {
    this.listAllSMS();
  },
};
</script>

<style lang="scss" scoped>
.sms-landing {
  ._intro {
    height: 75px;
    border-bottom: 0.75px solid #e1e1e1;
    padding: 14px 20px;
  }

  .conversation {
    &-list {
      border: 0.75px solid #e1e1e1;

      .message {
        padding: 15px;
        display: flex;
        align-items: flex-start;
        font-size: 13px;
        cursor: pointer;

        &-recipient {
          font-weight: bold;
        }

        &-trunc {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: #333;
          letter-spacing: -0.3px;
          width: 95%;
        }

        &-time {
          color: #7b7b7b;
          letter-spacing: 0;
          text-align: left;
          margin-left: 50px;
        }
      }
    }
  }

  .sms-community {
    height: 90vh;

      ._wrapper {
        width: 30%;
    }

    _intro-text {
      font-size: 36px;
    }
  }
}
</style>
