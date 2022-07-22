<template>
  <div class="sms" :class="{ onMobile }" :style="[sizeSMS]">
    <div v-if="!signUpDone" class="creator-signup">
      <div class="join-creator" :class="{ digitEntered }">
        <div v-if="digitEntered" class="_title">Confirm Your Number</div>
        <div v-else class="_title">Join this creator community</div>

        <div class="_user">
          <user-tag
            :user="currentUser"
            showAvatar
            hideTick
            hideName
            fitContent
            height="140"
            width="140"
            :clickUser="false"
          />

          <br />

          <user-tag
            :user="currentUser"
            fitContent
            showUserType
            :clickUser="false"
          />
        </div>

        <div v-if="digitEntered" class="message">
          You will receive text to this number. This number will also be used
          when you sign up to other SMS communities
        </div>
        <div v-else class="message">
          Enter your phone number to let creator send you text messages from
          this app. Phone numbers are never shared.
        </div>

        <div v-if="!digitEntered" class="_tel">
          <br />
          <img :src="require('@/assets/us_flag.svg')" width="18" class="flag" />
          <span class="digit">+ 0 1 (</span>
          <span v-for="(input, idx) in digitsLen" :key="idx">
            <input
              v-model.number="telDigits[idx]"
              type="text"
              name=""
              :id="`input-${idx}`"
              :ref="`input${idx}`"
              class="digit _num"
              pattern="([0-9])"
              maxlength="1"
              @keydown.delete="delDigit($event, idx)"
              @keyup.enter="submitTel"
            />
            <span v-if="idx === 2" class="digit">)</span>
            <span v-if="idx === 6" class="digit">-</span>
          </span>
        </div>

        <div v-else class="_tel-entered">{{ telFormatted }}</div>

        <v-btn
          v-if="digitEntered"
          round
          dark
          depressed
          class="width100"
          @click="signUpDone = true"
        >
          Confirm
          </v-btn>

        <h3
          v-if="digitEntered"
          class="cursor-pointer"
          @click="digitEntered = false"
        >
          Update my number
        </h3>
        <h3 v-if="!digitEntered" class="cursor-pointer" @click="closeSMS">
          No thanks, I’ll just follow
        </h3>
      </div>
    </div>

    <div v-if="signUpDone" class="signup-done">
      <img :src="require('@/assets/convo_icon_light.svg')" width="22" class="flag" alt="conversation icon">
      You’ve been added to this SMS list

      <v-btn depressed round class="done-btn" @click="closeSMS">Close</v-btn>
    </div>
  </div>
</template>

<script>
import UserTag from "@/components/user_tag";
import { mapState } from "vuex";

export default {
  components: {
    UserTag,
  },
  data() {
    return {
      telDigits: [],
      digitsLen: 9,
      digitEntered: false,
      signUpDone: false,
    };
  },
  watch: {
    telDigits: {
      handler(val) {
        if (val.length < this.digitsLen) {
          this.$refs[`input${[val.length]}`][0].focus();
        }
      },
      deep: true,
    },
  },
  methods: {
    submitTel() {
      // const validate = this.telDigits.every((tel) => typeof tel === "number")
      const validate =
        this.telDigits.length === this.digitsLen &&
        this.telDigits.every((tel) => typeof tel === "number");

      if (validate) {
        this.digitEntered = true;
      }
    },
    delDigit(evt, idx) {
      this.telDigits.splice(idx, 1, "");
    },
    closeSMS() {
      this.signUpDone = false;
      this.digitEntered = false;
      this.$emit("closeSMS");
    },
  },
  computed: {
    ...mapState({
      sideBarWidth: (state) => state.app.sideBarWidth,
      sideBarMini: (state) => state.app.sideBarMini,
    }),
    tel() {
      return this.telDigits.join("");
    },
    telFormatted() {
      return `+${this.tel}`.replace(/(.{4})/g, "$1-");
    },
    sizeSMS() {
      if (this.sidebarMini) {
        return { width: "calc(100% - " + this.sideBarWidth + "px)" };
      }
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
    isUserSubscribed() {
      return false;
    },
  },
  mounted() {
    this.$refs.input0[0].focus();
  },
};
</script>

<style lang="scss" scoped>
.sms-card {
  width: 400px;
  height: 600px;
  max-height: 70%;
  border-radius: 12px;
  margin: 0 auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ._title {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 10px;
  }
}
.sms {
  position: fixed;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.698);
  z-index: 99;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .join-creator {
    @extend .sms-card;
    text-align: center;
    background-color: #1b1b1bf2;
    color: #ffffff;

    &.digitEntered {
      background-color: #fffffff2;
      color: #000000;

      ._tel-entered {
        font-weight: bold;
        font-size: 1.3rem;
      }
      .message {
        border: 0;
      }
    }

    .message {
      padding: 10px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    ._tel {
      width: 100%;
      background-color: #ffffff;
      border-radius: 6px;
      padding: 10px;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;

      .flag {
        margin-right: 10px;
      }

      input {
        outline: none;
        height: 20px;
        border: none;
        border-bottom: 1px solid #8c8c8c;
        width: 12px;
        border-radius: 0;
      }

      .digit {
        margin-right: 5px;
        text-align: center;
      }
    }

    /deep/ .user_tag {
      .user-status {
        margin-top: -16px;
      }
      .bio-wrapper {
        text-align: center;
      }
    }
  }

  .signup-done {
    background: linear-gradient(180deg, #4D7AED 17.71%, #0F6FFF 100%);
    width: 200px;
    height: 200px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-radius: 22px;
    text-align: center;
    font-weight: bold;

    .done-btn {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
