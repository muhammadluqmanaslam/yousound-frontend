<template>
  <v-flex
    xs12
    sm12
    class="send-love-section"
    :class="{ transparent: showPaymentModal }"
  >
    <v-flex
      xs12
      sm12
      class="dismiss-section"
      @click="dismiss()"
      v-if="!showPaymentModal"
    ></v-flex>
    <v-layout row wrap class="popup-section" v-if="!showPaymentModal">
      <div class="top-section">
        <p class="title-label">Send payment to</p>
      </div>
      <v-flex xs12 class="profile-section">
        <label class="user-name"
          >{{ item.username }}
          <v-icon
            class="user-status"
            v-bind:class="{ online: item.status == 'active' }"
            v-if="item.user_type == 'artist'"
            >fa-check-circle</v-icon
          >
        </label>
        <div
          class="avatar-image"
          :style="{ 'background-image': 'url(' + item.avatar.thumb.url + ')' }"
        ></div>
      </v-flex>
      <!-- <v-flex xs12 class="donate-section">
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(10)">$10</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(20)">$20</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(40)">$40</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(100)">$100</v-btn>
      </v-flex> -->
      <v-flex xs12 class="input-section">
        <!-- <input type="text" class="donate-amount form-control" v-model="donate_amount" placeholder="$0.00"> -->
        <vue-numeric
          v-model="donate_amount"
          currency="$"
          separator=","
          :min="1"
          class="donate-amount"
        ></vue-numeric>
        <v-select
          v-model="description"
          :items="descriptions"
          class="pt-4"
          hide-details
        ></v-select>
        <p v-if="description === 'Add Video Credit'">
          Adding video credit gives this user more time to broadcast live video
        </p>
        <v-btn class="download-btn" @click.native="showPaymentDialog()">
          Go to checkout
        </v-btn>
      </v-flex>
    </v-layout>

    <payment-modal
      v-if="showPaymentModal"
      :receivers="[item]"
      :amount="donate_amount_by_cent"
      :dismiss="hidePaymentDialog"
      :finish="sendLove"
    ></payment-modal>
  </v-flex>
</template>

<script type="text/javascript">
import UserService from "@/services/user";
import paymentModal from "@/components/paymentmodal";
import { MyEvents } from "@/helper";

export default {
  components: {
    paymentModal,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      donate_amount: 0,
      description: "Donation",
      // descriptions: [
      //   'Donation',
      //   // 'Remix',
      //   // 'Vocalist',
      //   // 'Production',
      //   // 'Vocal Production',
      //   // 'Mixing',
      //   // 'Mastering',
      //   // 'Artwork',
      //   // 'Writer',
      //   // 'Session Musician'
      // ],
      showPaymentModal: false,
      buttonHover: false,
    };
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    followButtonText() {
      if (this.item.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },

    donate_amount_by_cent() {
      return this.donate_amount * 100;
    },

    isVideoCreditSelected() {
      return this.description === "Add Video Credit";
    },

    descriptions() {
      if (["listener"].indexOf(this.item.user_type) > -1) {
        return ["Donation"];
      } else {
        return ["Donation", "Add Video Credit"];
      }
    },
  },

  created() {},

  methods: {
    donateAmount(amount) {
      this.donate_amount = amount;
    },

    followUser() {
      if (this.item.is_following) {
        UserService.unfollowUser(this.item.id)
          .then((response) => {
            this.$store.dispatch("error/showSuccessToast", [
              "You just unfollowed " + this.item.username,
            ]);
            this.item.is_following = false;
            // this.$store.dispatch('player/setUpdatedUser', this.item)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.item.id, false);
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      } else {
        UserService.followUser(this.item.id)
          .then((response) => {
            this.$store.dispatch("error/showSuccessToast", [
              "You just followed " + this.item.username,
            ]);
            this.item.is_following = true;
            // this.$store.dispatch('player/setUpdatedUser', this.item)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.item.id, true);
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      }
    },

    showPaymentDialog() {
      if (this.donate_amount > 0) {
        this.showPaymentModal = true;
      }
    },

    hidePaymentDialog() {
      this.showPaymentModal = false;
    },

    sendLove(token) {
      this.dismiss();
      let params = {
        amount: this.donate_amount_by_cent,
        description: this.description,
      };
      if (token) {
        params["payment_token"] = token.id;
      }

      if (this.isVideoCreditSelected) {
        UserService.addVideoCredit(this.item.slug, params)
          .then((response) => {
            this.$store.dispatch("error/showSuccessToast", [
              `You've added $${this.donate_amount} video credit to ${this.item.username}`,
            ]);
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      } else {
        UserService.donateMoney(this.item.slug, params)
          .then((response) => {
            this.$store.dispatch("error/showSuccessToast", [
              `You've donated $${this.donate_amount} to ${this.item.username}`,
            ]);
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      }
    },
  },
};
</script>
